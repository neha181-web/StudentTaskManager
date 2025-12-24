const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importing the Task model
const Task = require('./models/Task'); 

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json()); // Parse incoming JSON requests

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- API ROUTES ---

// 1. GET: Fetch all tasks from the database
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }); // Newest tasks first
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// 2. POST: Create a new task
app.post('/api/tasks', async (req, res) => {
    console.log("📥 Incoming Data:", req.body); 

    try {
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority || 'Medium'
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        console.error("❌ Save Error:", err.message); 
        res.status(400).json({ error: err.message });
    }
});

// 3. PATCH: Toggle task completion status (Complete/Incomplete)
app.patch('/api/tasks/:id/toggle', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.completed = !task.completed; // True को False और False को True करेगा
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});

// 4. PUT: Update full task details
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ error: "Failed to update task" });
    }
});

// 5. DELETE: Remove a task by ID
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

// --- Server Setup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});