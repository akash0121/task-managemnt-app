const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task"); // Adjust path as needed
const User = require("../models/User"); // Adjust path as neede
const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  try {
    const tasks = await Task.find({ createdBy: userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    // Extracting data from the request body
    const { title, description, dueDate, priority, assignedTo, status, createdBy } = req.body.taskData;

    // Check if required fields are present
    if (!title || !priority || !status || !dueDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Convert 'dueDate' string to Date object and check if it is valid
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Create a new task with the correct data format
    const task = new Task({
      title,
      description,
      dueDate: parsedDueDate,
      priority,
      assignedTo,
      status,
      createdBy: createdBy
    });

    // Save the task
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error saving task:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});


router.put("/:id", async (req, res) => {
  try {

    const { id } = req.params; // Extracting the ID from the URL parameters
    const updates = req.body;

    // Updating the task by its ID
    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true
    });

    if (!updatedTask) {
      // If the task was not found
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
    console.log("Updated task:", updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
