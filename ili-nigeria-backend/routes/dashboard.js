import express from "express";
import {
  getAdminOverview,
  getClientOverview,
} from "../controllers/dashboardController.js";

const router = express.Router();

// Admin Dashboard Overview
router.get("/admin", getAdminOverview);

// Client Dashboard Overview (based on email)
router.get("/client/:email", getClientOverview);

export default router;
