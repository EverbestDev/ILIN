// routes/analytics.js
import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import { getAdminAnalytics, logEvent } from "../controllers/analyticsController.js";

const router = express.Router();

// Admin analytics (protected)
router.get("/", protect, restrictTo("admin"), getAdminAnalytics);
// Client telemetry
router.post("/log", logEvent);

export default router;
