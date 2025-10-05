// src/routes/task.js
import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();
router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
export default router;
