import express from "express";
import multer from "multer";
import { submitQuote } from "../controllers/quoteController.js";

const router = express.Router();

// Multer config (store in "uploads/")
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// POST /api/quotes
router.post("/", upload.array("documents", 5), submitQuote);

export default router;
