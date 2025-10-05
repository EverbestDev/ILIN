// src/controllers/taskController.js
import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { task, priority, due, email } = req.body;
    if (!task || !due)
      return res
        .status(400)
        .json({ message: "Task and due date are required" });
    const newTask = new Task({
      task,
      priority: priority || "medium",
      due,
      email,
    });
    await newTask.save();
    console.log("New task saved:", task, email);
    res.json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    console.log("Fetched tasks:", tasks.length);
    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const task = await Task.findByIdAndUpdate(id, { completed }, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    console.log("Task updated:", task.task, completed);
    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    console.log("Task deleted:", task.task);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
