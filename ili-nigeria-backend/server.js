import dotenv from "dotenv";
dotenv.config();

//weSocket
import { Server } from "socket.io";
import http from "http";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import admin from "firebase-admin";

import connectDB from "./config/db.js";

// Import routes
import emailRoutes from "./routes/email.js";
import contactRoutes from "./routes/contact.js";
import quoteRoutes from "./routes/quote.js";
import subscriberRoutes from "./routes/subscriber.js";
import adminRoutes from "./routes/admin.js";
import dashboardRoutes from "./routes/dashboard.js";
import taskRouter from "./routes/task.js";
import authRoutes from "./routes/auth.js";
import settingsRoutes from "./routes/settings.js";
import messageRoutes from "./routes/message.js";
import notificationRoutes from "./routes/notification.js";
import analyticsRoutes from "./routes/analytics.js";
import { protect, restrictTo } from "./middleware/auth.js";
import { startTaskReminder } from "./utils/taskReminder.js";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const app = express();
const server = http.createServer(app);

// Connect to database
connectDB();
startTaskReminder();

// Middlewares
app.use(express.json());

// CORS setup
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://ilin-nigeria.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

app.use(cors(corsOptions));

// Explicit OPTIONS handler
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    const origin = req.headers.origin;
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://ilin-nigeria.vercel.app",
    ];

    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization,X-Requested-With"
      );
      res.header("Access-Control-Allow-Credentials", "true");
      return res.sendStatus(204);
    }
  }
  next();
});

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
          "https://ilin-backend.onrender.com",
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
app.use("/api/messages", messageRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running with CORS fixed");
});

//WebSocket
// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://ilin-nigeria.vercel.app"],
    methods: ["GET", "POST"],
  },
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Unified join event for both admins & clients
  socket.on("join", ({ userId, admin }) => {
    try {
      if (admin) {
        socket.join("admins");
        console.log("👑 Admin joined 'admins' room");
      } else if (userId) {
        socket.join(`user:${userId}`);
        console.log(`🙋 Client joined room: user:${userId}`);
      } else {
        console.warn("⚠️ join event received without userId/admin");
      }
    } catch (err) {
      console.error("Join room error:", err);
    }
  });

  // Optional: for debugging, track rooms
  socket.on("rooms", () => {
    console.log("Socket rooms:", Array.from(socket.rooms));
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Make io accessible to controllers
app.set("io", io);




//Make io available to routes/controllers
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server & Socket.io running on port ${PORT}`)
);
