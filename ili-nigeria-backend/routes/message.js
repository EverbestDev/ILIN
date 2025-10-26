// routes/message.js
import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  createMessage,
  getMessages,
  getThreadMessages,
  replyToThread,
  markReadUnread,
  deleteThread,
} from "../controllers/messageController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create new thread (client)
router.post("/", createMessage);

// Get all threads (client sees own, admin sees all)
router.get("/", getMessages);

// Get single thread messages
router.get("/threads/:threadId", getThreadMessages);

// Reply to thread (both client and admin)
router.post("/threads/:threadId/reply", replyToThread);

// Mark message read/unread
router.patch("/:id/read", markReadUnread);

// Delete thread (admin only)
router.delete("/threads/:threadId", restrictTo("admin"), deleteThread);

export default router;
