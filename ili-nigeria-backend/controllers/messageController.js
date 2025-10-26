// controllers/messageController.js
import mongoose from "mongoose";
import Message from "../models/Message.js";
import admin from "firebase-admin";
import sendEmail from "../utils/email.js";

/**
 * CLIENT: Create new message thread
 * POST /api/messages
 */
export const createMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    const userId = req.user.uid;
    const threadId = new mongoose.Types.ObjectId().toString();

    // Create message
    const newMessage = await Message.create({
      threadId,
      userId,
      subject: subject.trim(),
      message: message.trim(),
      sender: "client",
      senderName: req.user.name || "Client User",
      senderEmail: req.user.email || "unknown@example.com",
      originType: "client_initiated",
    });

    // Send email notification to admin (only on thread creation)
    try {
      const adminEmails = process.env.ADMIN_EMAIL.split(",").map((e) =>
        e.trim()
      );
      await sendEmail(
        adminEmails,
        `New Message Thread - ${subject}`,
        `New message thread created by ${req.user.name || "Client"}

Subject: ${subject}
Message: ${message}

From: ${req.user.email}
Thread ID: ${threadId}

Please login to the admin dashboard to respond.`
      );
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Don't fail the request if email fails
    }

    // Emit to all admins via WebSocket
    const io = req.app.get("io");
    if (io) {
      io.to("admins").emit("new_client_message", {
        ...newMessage.toObject(),
        type: "new_thread",
      });
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

/**
 * GET all messages for user (client sees own, admin sees all)
 * GET /api/messages
 */
export const getMessages = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const query = isAdmin ? {} : { userId: req.user.uid };

    const messages = await Message.find(query).sort({ createdAt: -1 });

    // Group by threadId for easier frontend processing
    const threads = {};
    messages.forEach((msg) => {
      if (!threads[msg.threadId]) {
        threads[msg.threadId] = {
          threadId: msg.threadId,
          subject: msg.subject,
          userId: msg.userId,
          originType: msg.originType,
          messages: [],
          latestMessage: null,
          unreadCount: 0,
        };
      }
      threads[msg.threadId].messages.push(msg);

      // Track unread count
      if (!msg.isRead && msg.sender !== (isAdmin ? "admin" : "client")) {
        threads[msg.threadId].unreadCount++;
      }
    });

    // Set latest message for each thread
    Object.values(threads).forEach((thread) => {
      thread.messages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      thread.latestMessage = thread.messages[thread.messages.length - 1];
    });

    // Convert to array and sort by latest message
    const threadArray = Object.values(threads).sort(
      (a, b) =>
        new Date(b.latestMessage.createdAt) -
        new Date(a.latestMessage.createdAt)
    );

    res.json({
      success: true,
      data: threadArray,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

/**
 * GET single thread messages
 * GET /api/messages/threads/:threadId
 */
export const getThreadMessages = async (req, res) => {
  try {
    const { threadId } = req.params;
    const isAdmin = req.user.role === "admin";

    // Find all messages in thread
    const messages = await Message.find({ threadId }).sort({ createdAt: 1 });

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    // Check permission (client can only see their own threads)
    if (!isAdmin && messages[0].userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: {
        threadId,
        subject: messages[0].subject,
        messages,
      },
    });
  } catch (error) {
    console.error("Get thread messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch thread messages",
      error: error.message,
    });
  }
};

/**
 * REPLY to thread (both client and admin)
 * POST /api/messages/threads/:threadId/reply
 */
export const replyToThread = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const isAdmin = req.user.role === "admin";
    const sender = isAdmin ? "admin" : "client";

    // Get original thread to verify it exists and get userId
    const originalMessage = await Message.findOne({ threadId });
    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    // Check permission (client can only reply to their own threads)
    if (!isAdmin && originalMessage.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Create reply
    const reply = await Message.create({
      threadId,
      userId: originalMessage.userId, // Always use original thread's userId
      subject: originalMessage.subject,
      message: message.trim(),
      sender,
      senderName: req.user.name || (isAdmin ? "Admin" : "Client User"),
      senderEmail: req.user.email || "unknown@example.com",
      originType: originalMessage.originType,
    });

    // WebSocket notification
    const io = req.app.get("io");
    if (io) {
      if (sender === "client") {
        // Client replied → notify admins
        io.to("admins").emit("new_client_reply", reply);
      } else {
        // Admin replied → notify specific client
        io.to(`user-${originalMessage.userId}`).emit("new_admin_reply", reply);
      }
    }

    res.status(201).json({
      success: true,
      message: "Reply sent successfully",
      data: reply,
    });
  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reply",
      error: error.message,
    });
  }
};

/**
 * MARK message as read/unread
 * PATCH /api/messages/:id/read
 */
export const markReadUnread = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    if (typeof isRead !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isRead must be a boolean",
      });
    }

    const message = await Message.findByIdAndUpdate(
      id,
      { isRead },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // WebSocket notification
    const io = req.app.get("io");
    if (io) {
      // Notify both admin and client
      io.to("admins").emit("message_status_updated", {
        id: message._id,
        threadId: message.threadId,
        isRead,
      });
      io.to(`user-${message.userId}`).emit("message_status_updated", {
        id: message._id,
        threadId: message.threadId,
        isRead,
      });
    }

    res.json({
      success: true,
      message: "Message updated",
      data: message,
    });
  } catch (error) {
    console.error("Mark read/unread error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message",
      error: error.message,
    });
  }
};

/**
 * DELETE entire thread (admin only)
 * DELETE /api/messages/threads/:threadId
 */
export const deleteThread = async (req, res) => {
  try {
    const { threadId } = req.params;

    // Find all messages in thread
    const messages = await Message.find({ threadId });

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    const userId = messages[0].userId;

    // Delete all messages in thread
    const result = await Message.deleteMany({ threadId });

    // WebSocket notification
    const io = req.app.get("io");
    if (io) {
      io.to("admins").emit("thread_deleted", { threadId });
      io.to(`user-${userId}`).emit("thread_deleted", { threadId });
    }

    res.json({
      success: true,
      message: "Thread deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete thread error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete thread",
      error: error.message,
    });
  }
};
