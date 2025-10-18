import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  createMessage,
  getMessages,
  replyToThread,
  markReadUnread,
  deleteMessage,
} from "../controllers/messageController.js";

const router = express.Router();

// Client/Admin: Create new message
router.post("/", protect, createMessage);

// Client: Get own messages; Admin: Get all
router.get("/", protect, getMessages);

// Client/Admin: Reply to thread
router.post("/:threadId/reply", protect, replyToThread);

// Client/Admin: Mark read/unread
router.patch("/:id", protect, markReadUnread);

// Admin: Delete message
router.delete("/:id", protect, restrictTo("admin"), deleteMessage);

export default router;
