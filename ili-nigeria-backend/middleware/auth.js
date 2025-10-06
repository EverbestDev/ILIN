import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import admin from "firebase-admin";

import connectDB from "../config/db.js";

// Import routes
import emailRoutes from "../routes/email.js";
import contactRoutes from "../routes/contact.js";
import quoteRoutes from "../routes/quote.js";
import subscriberRoutes from "../routes/subscriber.js";
import adminRoutes from "../routes/admin.js";
import dashboardRoutes from "../routes/dashboard.js";
import taskRouter from "../routes/task.js";
import authRoutes from "../routes/auth.js";
import { protect, restrictTo } from "../middleware/auth.js";

// Utils
import { startTaskReminder } from "../utils/taskReminder.js";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(express.json());

// CORS setup - MUST come before helmet and other middleware
const corsOptions = {
  origin: ["http://localhost:5173", "https://ilin-nigeria.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400, // Cache preflight response for 24 hours
};

app.use(cors(corsOptions));

// Explicit OPTIONS handler for all routes
app.options("*", cors(corsOptions));

// Configure helmet AFTER CORS
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://*.googleapis.com",
          "https://*.firebaseio.com",
          "https://ilin-nigeria-backend.onrender.com",
        ],
        frameSrc: ["'self'", "https://*.firebaseapp.com"],
        scriptSrc: ["'self'", "https://*.googleapis.com"],
      },
    },
  })
);

app.use(morgan("dev"));

// Register routes
app.use("/api", emailRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/subscribe", subscriberRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", protect, restrictTo("admin"), dashboardRoutes);
app.use("/api/admin", protect, restrictTo("admin"), adminRoutes);
app.use("/api/tasks", protect, restrictTo("admin"), taskRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running with CORS fixed");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
