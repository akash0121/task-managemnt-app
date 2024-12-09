const mongoose = require("mongoose");
const User = require("./User");

// Define the Task Schema
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  dueDate: {
    type: String,
    required: false,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
  assignedTo: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["in-progress", "completed", "pending"],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Automatically update 'updatedAt' field when a task is updated
TaskSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model("Task", TaskSchema);
