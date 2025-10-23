import mongoose from "mongoose";
import Message from "../models/Message.js";
import sendEmail from "../utils/email.js";

/** CREATE MESSAGE — CLIENT → ADMIN **/
export const createMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message)
      return res
        .status(400)
        .json({ message: "Subject and message are required" });

    const userId = req.user.uid;
    const threadId = new mongoose.Types.ObjectId().toString();

    // Store client message
    const newMessage = await Message.create({
      userId,
      threadId,
      subject,
      message,
      sender: "client",
      name: req.user.name || "Unnamed User",
      email: req.user.email || "unknown@example.com",
    });

    // Notify admin by email
    await sendEmail(
      process.env.ADMIN_EMAIL.split(","),
      `New Message from ${req.user.email} - ILI Nigeria`,
      `Subject: ${subject}\n\nMessage: ${message}\n\nFrom: ${req.user.name} <${req.user.email}>`
    );

    // Emit to all admins
    const io = req.app.get("io");
    io.to("admins").emit("newMessage", {
      ...newMessage.toObject(),
      source: "client",
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: { ...newMessage.toObject(), source: "sender" },
    });
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/** GET MESSAGES **/
export const getMessages = async (req, res) => {
  try {
    const isAdmin = req.user.admin;
    const query = isAdmin ? {} : { userId: req.user.uid };

    const messages = await Message.find(query).sort({ createdAt: -1 });

    res.json(
      messages.map((m) => ({
        ...m.toObject(),
        source: m.sender,
        name: m.name || "Unknown",
        email: m.email || "unknown@example.com",
      }))
    );
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/** REPLY TO THREAD **/
export const replyToThread = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ message: "Message is required" });

    const threadId = req.params.threadId;
    const sender = req.user.admin ? "admin" : "client";

    const originalMessage = await Message.findOne({ threadId });
    if (!originalMessage)
      return res.status(404).json({ message: "Original thread not found" });

    const userId = sender === "client" ? req.user.uid : originalMessage.userId;

    const newMessage = await Message.create({
      userId,
      threadId,
      subject: "Reply",
      message,
      sender,
      name: req.user.name || (sender === "admin" ? "Admin" : "Unnamed User"),
      email: req.user.email || "unknown@example.com",
    });

    // Emit correct sender via WebSocket
    const io = req.app.get("io");
    io.emit("newReply", { ...newMessage.toObject(), source: sender });

    // Determine correct recipient
    let recipientEmail;

    if (sender === "admin") {
      try {
        const firebaseAdmin = (await import("firebase-admin")).default;
        const userRecord = await firebaseAdmin.auth().getUser(userId);
        recipientEmail = userRecord.email;
      } catch (err) {
        console.error("Failed to fetch client email:", err.message);
        recipientEmail = process.env.ADMIN_EMAIL.split(","); // fallback
      }
    } else {
      recipientEmail = process.env.ADMIN_EMAIL.split(",");
    }

    // Send reply email
    await sendEmail(
      recipientEmail,
      `New Reply in Thread - ILI Nigeria`,
      `New reply: ${message}\n\nFrom: ${req.user.email}`
    );

    res.json({
      message: "Reply sent successfully",
      data: { ...newMessage.toObject(), source: sender },
    });
  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).json({ message: "Failed to send reply" });
  }
};

/** MARK READ/UNREAD **/
export const markReadUnread = async (req, res) => {
  try {
    const { isRead } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: "Message not found" });

    res.json({
      message: "Message updated",
      data: { ...message.toObject(), source: message.sender },
    });

    const io = req.app.get("io");

    io.to(message.userId).emit("messageStatusUpdated", {
      id: message._id,
      isRead,
    });

    if (message.sender === "client") {
      io.to("admins").emit("messageStatusUpdated", {
        id: message._id,
        isRead,
        userId: message.userId,
      });
    }
  } catch (error) {
    console.error("Mark read/unread error:", error);
    res.status(500).json({ message: "Failed to update message" });
  }
};

/** DELETE MESSAGE OR CONTACT **/
export const deleteMessage = async (req, res) => {
  try {
    // Try message collection first
    let deleted = await Message.findByIdAndDelete(req.params.id);

    // If not found, try contact collection (lazy import)
    if (!deleted) {
      const { default: Contact } = await import("../models/Contact.js");
      deleted = await Contact.findByIdAndDelete(req.params.id);
    }

    if (!deleted)
      return res.status(404).json({ message: "Message/Contact not found" });

    res.json({ message: "Item deleted successfully" });

    const io = req.app.get("io");

    io.to("admins").emit("messageDeleted", {
      id: deleted._id,
      userId: deleted.userId,
    });
    io.to(deleted.userId).emit("messageDeleted", { id: deleted._id });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: "Failed to delete message/contact" });
  }
};
