// src/models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium",
  },
  due: { type: String, required: true },
  completed: { type: Boolean, default: false },
  email: { type: String, required: true }, // Recipient for reminders
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Task", taskSchema);
