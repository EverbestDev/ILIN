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
    const newMessage = await Message.create({
      userId,
      threadId,
      subject,
      message,
      sender: "client",
    });
    await sendEmail(
      process.env.ADMIN_EMAIL,
      `New Message from ${req.user.email} - ILI Nigeria`,
      `Subject: ${subject}\n\nMessage: ${message}\n\nFrom: ${req.user.email}`
    );
    res.json({
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
    res.json(messages.map((m) => ({ ...m.toObject(), source: "client" })));
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
    const userId =
      sender === "client"
        ? req.user.uid
        : (await Message.findOne({ threadId })).userId;
    const newMessage = await Message.create({
      userId,
      threadId,
      subject: "Reply",
      message,
      sender,
    });
    const email =
      sender === "admin"
        ? (await Message.findOne({ threadId })).userId
        : process.env.ADMIN_EMAIL;
    await sendEmail(
      email,
      `New Reply in Thread - ILI Nigeria`,
      `New reply: ${message}\n\nFrom: ${req.user.email}`
    );
    res.json({
      message: "Reply sent successfully",
      data: { ...newMessage.toObject(), source: "client" },
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
      data: { ...message.toObject(), source: "client" },
    });
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
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: "Failed to delete message" });
  }
};
