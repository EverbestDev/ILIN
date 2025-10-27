import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  submitContact,
  getContacts,
  getContact,
  deleteContact,
  archiveContact,
  convertToThread,
} from "../controllers/contactController.js";

const router = express.Router();

// Public route (no auth)
router.post("/", submitContact);

// Admin routes (auth required)
router.get("/", protect, restrictTo("admin"), getContacts);
router.get("/:id", protect, restrictTo("admin"), getContact);
router.delete("/:id", protect, restrictTo("admin"), deleteContact);
router.patch("/:id/archive", protect, restrictTo("admin"), archiveContact);
router.post("/:id/convert", protect, restrictTo("admin"), convertToThread);

export default router;
