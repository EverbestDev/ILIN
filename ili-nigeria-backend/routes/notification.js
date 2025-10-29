// routes/notification.js
import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  getAdminNotifications,
  getClientNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// Admin notifications
router.get("/admin", protect, restrictTo("admin"), getAdminNotifications);

// Client notifications
router.get("/client", protect, getClientNotifications);

// Mark as read
router.post("/read", protect, markNotificationRead);

export default router;
