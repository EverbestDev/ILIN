// src/utils/taskReminder.js
import cron from "node-cron";
import Task from "../models/Task.js";
import sendEmail from "./email.js";

export const startTaskReminder = () => {
  // Run daily at 8 AM WAT (7 AM UTC)
  cron.schedule(
    "0 7 * * *",
    async () => {
      try {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const tasks = await Task.find({
          completed: false,
          due: { $lte: tomorrow.toISOString().split("T")[0] + " 23:59" },
          email: { $exists: true },
        });
        for (const task of tasks) {
          await sendEmail(
            task.email,
            `Task Reminder: ${task.task}`,
            `Your task "${task.task}" is due on ${task.due}. Please complete it soon!`
          );
          console.log(`Reminder sent for task: ${task.task}`);
        }
      } catch (error) {
        console.error("Task reminder error:", error);
      }
    },
    {
      timezone: "Africa/Lagos",
    }
  );
};
