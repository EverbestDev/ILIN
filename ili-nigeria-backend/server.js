import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";

// 👉 Import routes
import emailRoutes from "./routes/email.js";
import contactRoutes from "./routes/contact.js"; // Add this near your other imports

const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// ✅ CORS setup (allow Vite frontend)
app.use(
  cors({
    origin: "https://ilin-nigeria.vercel.app", // your frontend URL
    credentials: true, // if you need cookies/auth
  })
);

// 👉 Register routes
app.use("/api", emailRoutes);
app.use("/api/contact", contactRoutes); // Add this after app.use("/api", emailRoutes)

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀 with CORS fixed");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
