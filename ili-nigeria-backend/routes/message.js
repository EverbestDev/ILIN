// routes/message.js
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

router.post("/", protect, createMessage);
router.get("/", protect, getMessages);
router.post("/:threadId/reply", protect, replyToThread);
router.patch("/:id", protect, markReadUnread);
router.delete("/:id", protect, restrictTo("admin"), deleteMessage);

export default router;
