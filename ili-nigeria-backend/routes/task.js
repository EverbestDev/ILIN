// src/routes/task.js
import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import Task from "../models/Task.js";
import sendEmail from "../utils/email.js"; // Import for test endpoint

const router = express.Router();
router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

// Add manual test endpoint
router.post("/reminder-test", async (req, res) => {
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tasks = await Task.find({
      completed: false,
      due: { $lte: tomorrow.toISOString().split("T")[0] + " 23:59" },
      email: { $exists: true },
    });
    console.log(
      `Manual test: Found ${
        tasks.length
      } eligible tasks at ${new Date().toISOString()}`
    );
    for (const task of tasks) {
      await sendEmail(
        task.email,
        `Test Reminder: ${task.task}`,
        `Test: Your task "${task.task}" is due on ${
          task.due
        }. (Sent at ${new Date().toLocaleString("en-NG", {
          timeZone: "Africa/Lagos",
        })})`
      );
      console.log(
        `Manual reminder sent for task: ${task.task} to ${task.email}`
      );
    }
    res.json({ message: `Test sent for ${tasks.length} tasks` });
  } catch (error) {
    console.error("Manual reminder error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
