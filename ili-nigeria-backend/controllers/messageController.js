// controllers/messageController.js
import mongoose from "mongoose";
import Message from "../models/Message.js";
import sendEmail from "../utils/email.js";

/**
 * Helper: normalize ADMIN_EMAIL env into array of valid emails
 */
const getAdminEmails = () => {
  const raw = process.env.ADMIN_EMAIL || "";
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e && e.includes("@"));
};

export const createMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message required" });
    }

    // If admin creates a thread on behalf of a public contact, they can pass userId,name,email.
    const isAdmin = !!req.user?.admin;
    const userId = isAdmin ? req.body.userId || null : req.user.uid;
    const name = isAdmin ? req.body.name || null : req.user.name || null;
    const email = isAdmin ? req.body.email || null : req.user.email || null;

    const threadId = new mongoose.Types.ObjectId().toString();

    const newMessage = await Message.create({
      userId,
      threadId,
      subject,
      message,
      sender: "client",
      name,
      email,
    });

    // Emit: new thread to admins only
    const io = req.app.get("io");
    io.to("admins").emit("newThread", { ...newMessage.toObject() });

    // Send admin email only when a **real client** created the thread (not when admin creates on behalf)
    if (!isAdmin) {
      try {
        const adminEmails = getAdminEmails();
        if (adminEmails.length) {
          // sendEmail expects string or array-of-strings
          await sendEmail(
            adminEmails,
            `New Message from ${email || "client"} - ILI Nigeria`,
            `Subject: ${subject}\n\nMessage: ${message}\n\nFrom: ${name || email || "Client"}`
          );
        }
      } catch (err) {
        // Log but don't crash the request — email failures shouldn't block thread creation
        console.error("Email send (newThread) failed:", err?.message || err);
      }
    }

    return res.status(201).json({
      message: "Message sent successfully",
      data: { ...newMessage.toObject() },
    });
  } catch (error) {
    console.error("Create message error:", error);
    return res.status(500).json({ message: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const isAdmin = !!req.user?.admin;
    const query = isAdmin ? {} : { userId: req.user.uid };
    const messages = await Message.find(query).sort({ createdAt: -1 });
    // return raw messages; frontend groups by threadId
    return res.json(
      messages.map((m) => ({
        ...m.toObject(),
        name: m.name || null,
        email: m.email || null,
      }))
    );
  } catch (error) {
    console.error("Fetch messages error:", error);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const replyToThread = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const threadId = req.params.threadId;
    const sender = req.user?.admin ? "admin" : "client";

    // find original thread (first message)
    const original = await Message.findOne({ threadId });
    if (!original) {
      return res.status(404).json({ message: "Thread not found" });
    }

    // If admin replies, recipient userId is original.userId (may be null for public contacts)
    const userId = sender === "admin" ? original.userId : req.user.uid;

    const newMessage = await Message.create({
      userId,
      threadId,
      subject: "Reply",
      message,
      sender,
      name: sender === "client" ? req.user.name || original.name : original.name,
      email: sender === "client" ? req.user.email || original.email : original.email,
    });

    // Emit sockets:
    const io = req.app.get("io");
    // admins should always see replies (update their thread view)
    io.to("admins").emit("newReply", { ...newMessage.toObject() });

    // If there is a userId (logged-in client), notify them in their room
    if (userId) {
      io.to(`user:${userId}`).emit("newReply", { ...newMessage.toObject() });
    }

    // Do NOT send email on replies (avoids spam and email 400 issues).
    return res.json({
      message: "Reply sent successfully",
      data: { ...newMessage.toObject() },
    });
  } catch (error) {
    console.error("Reply error:", error);
    return res.status(500).json({ message: "Failed to send reply" });
  }
};

export const markReadUnread = async (req, res) => {
  try {
    const { isRead } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const io = req.app.get("io");
    // notify owner
    if (message.userId) {
      io.to(`user:${message.userId}`).emit("messageStatusUpdated", {
        id: message._id,
        isRead,
      });
    }
    // notify admins
    io.to("admins").emit("messageStatusUpdated", {
      id: message._id,
      isRead,
      userId: message.userId,
    });

    return res.json({ message: "Message updated", data: { ...message.toObject() } });
  } catch (error) {
    console.error("Mark read/unread error:", error);
    return res.status(500).json({ message: "Failed to update message" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const io = req.app.get("io");
    // notify owner & admins
    if (message.userId) {
      io.to(`user:${message.userId}`).emit("messageDeleted", { id: message._id });
    }
    io.to("admins").emit("messageDeleted", { id: message._id, userId: message.userId });

    return res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    return res.status(500).json({ message: "Failed to delete message" });
  }
};
