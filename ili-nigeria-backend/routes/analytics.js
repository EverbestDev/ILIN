// routes/analytics.js
import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import { getAdminAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// Admin analytics (protected)
router.get("/", protect, restrictTo("admin"), getAdminAnalytics);

export default router;
