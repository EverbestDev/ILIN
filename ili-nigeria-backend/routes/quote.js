import express from "express";
import multer from "multer";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  submitQuote,
  getAllQuotes,
  getQuoteById,
  deleteQuote,
  getClientQuotes
} from "../controllers/quoteController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/rtf",
      "application/vnd.oasis.opendocument.text",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  },
});

const uploadMiddleware = (req, res, next) => {
  upload.array("documents", 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large (max 10MB)" });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.post("/", uploadMiddleware, submitQuote);
router.get("/", protect, restrictTo("admin"), getAllQuotes);
router.get("/:id", protect, getQuoteById);
router.delete("/:id", protect, restrictTo("admin"), deleteQuote);
router.get("/client", protect, getClientQuotes);

export default router;
