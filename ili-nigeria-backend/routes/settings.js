// routes/settings.js
import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  getAdminSettings,
  updateAdminSettings,
  getUserSettings,
  updateUserSettings,
} from "../controllers/settingsController.js";

const router = express.Router();

// Admin settings routes
router.get("/admin", protect, restrictTo("admin"), getAdminSettings);
router.post("/admin", protect, restrictTo("admin"), updateAdminSettings);

// User settings routes
router.get("/user", protect, getUserSettings);
router.post("/user", protect, updateUserSettings);

export default router;
