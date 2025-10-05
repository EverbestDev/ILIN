import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";

// Import routes
import emailRoutes from "./routes/email.js";
import contactRoutes from "./routes/contact.js";
import quoteRoutes from "./routes/quote.js";
import subscriberRoutes from "./routes/subscriber.js";
import adminRoutes from "./routes/admin.js";
import dashboardRoutes from "./routes/dashboard.js";
import taskRouter from "./routes/task.js";

//utils
import { startTaskReminder } from "./utils/taskReminder.js";



const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ilin-nigeria.vercel.app",
      "https://ilin-nigeria.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Register routes
app.use("/api", emailRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/subscribe", subscriberRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tasks", taskRouter);


// Test route
app.get("/", (req, res) => {
  res.send("Backend is running with CORS fixed");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


