import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";

//  Import routes
import emailRoutes from "./routes/email.js";
import contactRoutes from "./routes/contact.js"; // Add this near your other imports
import quoteRoutes from "./routes/quote.js";

const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

//  CORS setup allow both local + production frontend
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://ilin-nigeria.vercel.app", // production
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !allowedOrigins.includes(origin)) {
        return callback(new Error("Not allowed by CORS"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

//  Register routes
app.use("/api", emailRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/quotes", quoteRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running with CORS fixed");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
