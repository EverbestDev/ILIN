import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  subscribe,
  getAllSubscribers,
  deleteSubscriber,
  resendWelcomeEmail,
  verifySubscription,
} from "../controllers/subscriberController.js";

const router = express.Router();

// Public: Subscribe via footer
router.post("/", subscribe);
// Verify subscription
router.get("/verify/:token", verifySubscription);

// Admin: Get all subscribers
router.get("/", protect, restrictTo("admin"), getAllSubscribers);

// Admin: Delete a subscriber
router.delete("/:id", protect, restrictTo("admin"), deleteSubscriber);

// Admin: Resend welcome email
router.post("/resend/:id", protect, restrictTo("admin"), resendWelcomeEmail);

export default router;
