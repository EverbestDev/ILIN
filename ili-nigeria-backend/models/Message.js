// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    threadId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      enum: ["client", "admin"],
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    originType: {
      type: String,
      enum: ["client_initiated", "admin_initiated"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
messageSchema.index({ threadId: 1, createdAt: 1 });
messageSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
