// utils/taskReminder.js
import cron from "node-cron";
import Task from "../models/Task.js";
import sendEmail from "./email.js";

/**
 * Task Reminder Cron Job
 * Runs daily at 7:00 AM (Africa/Lagos timezone)
 * Sends email 24 hours before task due date
 */
export const startTaskReminder = () => {
  // Run every day at 7:00 AM
  cron.schedule(
    "0 7 * * *",
    async () => {
      try {
        console.log(`[${new Date().toISOString()}] Task reminder cron started`);

        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // Format dates for comparison (YYYY-MM-DD HH:mm format)
        const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0, 0));
        const tomorrowEnd = new Date(tomorrow.setHours(23, 59, 59, 999));

        // Find tasks due in the next 24 hours (not completed)
        const tasks = await Task.find({
          completed: false,
          email: { $exists: true, $ne: null },
        });

        // Filter tasks due within 24 hours
        const dueSoonTasks = tasks.filter((task) => {
          const dueDate = new Date(task.due);
          return dueDate >= tomorrowStart && dueDate <= tomorrowEnd;
        });

        console.log(`Found ${dueSoonTasks.length} tasks due in 24 hours`);

        // Group tasks by email
        const tasksByEmail = {};
        dueSoonTasks.forEach((task) => {
          if (!tasksByEmail[task.email]) {
            tasksByEmail[task.email] = [];
          }
          tasksByEmail[task.email].push(task);
        });

        // Send emails
        for (const [email, emailTasks] of Object.entries(tasksByEmail)) {
          try {
            const taskListHTML = emailTasks
              .map(
                (task) => `
              <div style="padding: 15px; margin: 10px 0; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
                <h3 style="margin: 0 0 10px 0; color: #856404;">⏰ ${
                  task.task
                }</h3>
                <p style="margin: 5px 0; color: #856404;">
                  <strong>Priority:</strong> <span style="text-transform: capitalize;">${
                    task.priority
                  }</span>
                </p>
                <p style="margin: 5px 0; color: #856404;">
                  <strong>Due:</strong> ${new Date(task.due).toLocaleString(
                    "en-NG",
                    {
                      timeZone: "Africa/Lagos",
                      dateStyle: "full",
                      timeStyle: "short",
                    }
                  )}
                </p>
              </div>
            `
              )
              .join("");

            const emailContent = `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
                <div style="text-align: center; padding-bottom: 20px;">
                  <h1 style="color: #2f855a;">ILI Nigeria</h1>
                  <p style="color: #718096;">Task Reminder - Due in 24 Hours</p>
                </div>
                <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <p>Hi there,</p>
                  <p>You have <strong>${emailTasks.length}</strong> task${
              emailTasks.length > 1 ? "s" : ""
            } due in the next 24 hours:</p>
                  ${taskListHTML}
                  <p style="margin-top: 20px;">
                    Please login to your dashboard to manage your tasks:
                    <a href="https://ilin-nigeria.vercel.app/admin/schedules" style="color: #2f855a; font-weight: bold;">View Tasks</a>
                  </p>
                </div>
                <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 20px;">
                  ILI Nigeria | Admin Dashboard
                </div>
              </div>
            `;

            await sendEmail(
              email,
              `⏰ Task Reminder - ${emailTasks.length} Task${
                emailTasks.length > 1 ? "s" : ""
              } Due Tomorrow`,
              emailContent
            );

            console.log(
              `✅ Reminder sent to ${email} for ${emailTasks.length} task(s)`
            );
          } catch (emailError) {
            console.error(
              `❌ Failed to send reminder to ${email}:`,
              emailError.message
            );
          }
        }

        console.log(
          `[${new Date().toISOString()}] Task reminder cron completed`
        );
      } catch (error) {
        console.error("❌ Task reminder cron error:", error);
      }
    },
    {
      timezone: "Africa/Lagos",
    }
  );

  console.log(
    "✅ Task reminder cron job started (runs daily at 7:00 AM Africa/Lagos)"
  );
};
