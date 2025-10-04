import express from "express";
import { getOverviewStats } from "../controllers/adminController.js";

const router = express.Router();

router.get("/overview", getOverviewStats);

export default router;
