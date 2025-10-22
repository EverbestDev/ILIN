import mongoose from "mongoose";
import Message from "../models/Message.js";
import sendEmail from "../utils/email.js";

export const createMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res
        .status(400)
        .json({ message: "Subject and message are required" });
    }

    const userId = req.user.uid;
    const threadId = new mongoose.Types.ObjectId().toString();

    // Save message to DB
    const newMessage = await Message.create({
      userId,
      threadId,
      subject,
      message,
      sender: "client",
      name: req.user.name,
      email: req.user.email,
    });

    // Send email notification to admin
    await sendEmail(
      [process.env.ADMIN_EMAIL, "olawooreusamahabidemi@gmail.com"],
      `New Message from ${req.user.email} - ILI Nigeria`,
      `Subject: ${subject}\n\nMessage: ${message}\n\nFrom: ${req.user.name} <${req.user.email}>`
    );

    // Emit to admins only via socket
    const io = req.app.get("io");
    io.to("admins").emit("newMessage", {
      ...newMessage.toObject(),
      source: "client",
    });

    // Respond to client
    res.status(201).json({
      message: "Message sent successfully",
      data: { ...newMessage.toObject(), source: "client" },
    });
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const isAdmin = req.user.admin;
    const query = isAdmin ? {} : { userId: req.user.uid };
    const messages = await Message.find(query).sort({ createdAt: -1 });

    res.json(
      messages.map((m) => ({
        ...m.toObject(),
        source: "client",
        name: m.name || "Unknown",
        email: m.email || "unknown@example.com",
      }))
    );
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};


export const replyToThread = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const threadId = req.params.threadId;
    const sender = req.user.admin ? "admin" : "client";

    // Find the original thread message
    const baseMessage = await Message.findOne({ threadId });
    if (!baseMessage) {
      return res.status(404).json({ message: "Thread not found" });
    }

    // Determine userId: if admin replies, send to thread owner; else use current user
    const userId = sender === "client" ? req.user.uid : baseMessage.userId;

    // Create reply message with original subject
    const newMessage = await Message.create({
      userId,
      threadId,
      subject: baseMessage.subject || "Reply",
      message,
      sender,
      name: sender === "client" ? req.user.name : baseMessage.name,
      email: sender === "client" ? req.user.email : baseMessage.email,
    });

    const io = req.app.get("io");

    // --- SOCKET EMISSION ---
    if (sender === "admin") {
      // Send reply to the thread owner
      io.to(userId).emit("newReply", {
        ...newMessage.toObject(),
        source: "admin",
      });
    } else {
      // Notify all admins about client reply
      io.to("admins").emit("newReply", {
        ...newMessage.toObject(),
        source: "client",
      });
    }

    // --- EMAIL NOTIFICATION ---
    const recipientEmails =
      sender === "admin"
        ? [baseMessage.email, process.env.ADMIN_EMAIL].filter(Boolean)
        : [process.env.ADMIN_EMAIL];

    await sendEmail(
      recipientEmails,
      `New Reply in Thread - ILI Nigeria`,
      `
Subject: ${newMessage.subject}
Message: ${message}
From: ${req.user.email || "unknown@example.com"}
      `
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

    res.json({
      message: "Message updated",
      data: { ...message.toObject(), source: message.sender },
    });

    const io = req.app.get("io");

    // Notify the owner of the message about the change
    io.to(message.userId).emit("messageStatusUpdated", {
      id: message._id,
      isRead,
    });

    // Optional: notify admins if the message belongs to a client
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


export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });

    const io = req.app.get("io");

    // Notify the user whose message was deleted
    io.to(message.userId).emit("messageDeleted", {
      id: message._id,
    });

    // Optional: notify all admins about the deletion
    io.to("admins").emit("messageDeleted", {
      id: message._id,
      userId: message.userId,
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: "Failed to delete message" });
  }
};

