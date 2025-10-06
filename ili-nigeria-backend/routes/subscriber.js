import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  subscribe,
  getSubscribers,
} from "../controllers/subscriberController.js";

const router = express.Router();

router.post("/", subscribe);
router.get("/", protect, restrictTo("admin"), getSubscribers);

export default router;
