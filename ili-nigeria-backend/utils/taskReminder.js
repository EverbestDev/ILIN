// src/utils/taskReminder.js
import cron from "node-cron";
import Task from "../models/Task.js";
import sendEmail from "./email.js";

export const startTaskReminder = () => {
  // Run daily at 7 AM WAT (6 AM UTC)
  cron.schedule(
    "0 7 * * *",
    async () => {
      try {
        console.log(
          `Reminder job running at: ${new Date().toISOString()} (WAT: ${new Date().toLocaleString(
            "en-NG",
            { timeZone: "Africa/Lagos" }
          )})`
        );
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const tasks = await Task.find({
          completed: false,
          due: { $lte: tomorrow.toISOString().split("T")[0] + " 23:59" },
          email: { $exists: true },
        });
        console.log(`Found ${tasks.length} eligible tasks for reminders`);
        for (const task of tasks) {
          await sendEmail(
            task.email,
            `Task Reminder: ${task.task}`,
            `Your task "${task.task}" is due on ${task.due}. Please complete it soon!`
          );
          console.log(`Reminder sent for task: ${task.task} to ${task.email}`);
        }
      } catch (error) {
        console.error("Task reminder error:", error);
      }
    },
    {
      timezone: "Africa/Lagos",
    }
  );
  console.log("Task reminder cron job scheduled");
};
