const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import authentication middleware
const router = express.Router();

//  Get tasks for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//  Create task (only for logged-in user)
router.post("/", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const task = new Task({ user: req.user, title, description });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//  Update task (only if it belongs to the user)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ error: "Task not found or unauthorized" });

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.completed = req.body.completed ?? task.completed;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//  Delete task (only if it belongs to the user)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ error: "Task not found or unauthorized" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
