// src/models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium",
  },
  due: { type: String, required: true }, // Store as string (e.g., "2025-10-06 15:00")
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Task", taskSchema);
