import express from "express";
import {
  getProfile,
  setClaimsAndGetProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.post("/set-claims-and-get-profile", protect, setClaimsAndGetProfile);

export default router;


