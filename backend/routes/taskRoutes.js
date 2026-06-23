const express = require('express');
const Task = require('../models/Task');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new task
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      user: req.userId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Get all tasks of logged-in user (with filter, search, sort)
router.get('/', protect, async (req, res) => {
  try {
    const { status, search, sortBy } = req.query;

    let query = { user: req.userId };

    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'pending') {
      query.completed = false;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sortBy === 'priority') {
      sortOption = { priority: 1 };
    } else if (sortBy === 'dueDate') {
      sortOption = { dueDate: 1 };
    }

    const tasks = await Task.find(query).sort(sortOption);

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Get task statistics
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const total = await Task.countDocuments({ user: req.userId });
    const completed = await Task.countDocuments({ user: req.userId, completed: true });
    const pending = await Task.countDocuments({ user: req.userId, completed: false });
    const overdue = await Task.countDocuments({
      user: req.userId,
      completed: false,
      dueDate: { $lt: new Date() },
    });

    res.status(200).json({ total, completed, pending, overdue });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Get single task by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a task
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Toggle task completion status
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete all completed tasks
router.delete('/completed', protect, async (req, res) => {
  try {
    await Task.deleteMany({ user: req.userId, completed: true });
    res.status(200).json({ message: 'All completed tasks deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a single task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.deleteOne();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;