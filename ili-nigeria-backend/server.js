import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";

// Import your existing routes
import emailRoutes from "./routes/email.js";
import contactRoutes from "./routes/contact.js";
import quoteRoutes from "./routes/quote.js";
import subscriberRoutes from "./routes/subscriber.js";
import adminRoutes from "./routes/admin.js";
import dashboardRoutes from "./routes/dashboard.js";
import taskRouter from "./routes/task.js";

// REMOVED: import authRoutes from "./routes/auth.js";
// REMOVED: import { protect, restrictTo } from "./controllers/authController.js";

// NEW: Import the Auth0 JWT validation and Role check middleware
import { checkJwt, checkRole } from "./middleware/auth.js";

//utils
import { startTaskReminder } from "./utils/taskReminder.js";

const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// CORS setup (Using a single env variable for the frontend origin)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ----------------------------------------------------------------------
// Route Registration and Protection using Auth0
// ----------------------------------------------------------------------

// 1. PUBLIC ROUTES (No Auth0 middleware applied)
app.use("/api", emailRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/subscribe", subscriberRoutes);

// REMOVED: app.use("/api/auth", authRoutes); // Auth0 handles login/register

// 2. PROTECTED ADMIN ROUTES (Requires a valid JWT AND the user must have the 'admin' role)
// We chain the middleware: checkJwt (verifies token) -> checkRole (looks up user/role)
const adminProtected = [checkJwt, checkRole(["admin"])];

// These routes were previously protected with protect, restrictTo("admin")
app.use("/api/dashboard", adminProtected, dashboardRoutes); // Admin Dashboard Data
app.use("/api/admin", adminProtected, adminRoutes); // General Admin API routes
app.use("/api/tasks", adminProtected, taskRouter); // Admin Task Management

// 3. PROTECTED CLIENT ROUTES (Requires a valid JWT and the user must have 'client' or 'admin' role)
// If you add client-specific routes later (e.g., for orders), they would use this:
// const clientProtected = [checkJwt, checkRole(['admin', 'client'])];
// app.use("/api/client-details", clientProtected, clientRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running with Auth0 protection applied");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Start the task reminder utility (Keep this)
startTaskReminder();
