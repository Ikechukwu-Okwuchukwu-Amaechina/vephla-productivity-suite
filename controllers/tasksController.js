const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    // Validate assignedTo user exists if provided
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const user = await User.findById(assignedTo);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    }

    const task = new Task({
      title,
      description: description || '',
      dueDate: dueDate || null,
      userId: req.user.id,
      assignedTo: assignedTo || null
    });

    await task.save();
    return res.status(201).json({ success: true, message: 'Task created', task });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error creating task', error: err.message });
  }
};

// Get all tasks for the current user
exports.getTasks = async (req, res) => {
  try {
    const { completed, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { userId: req.user.id },
        { assignedTo: req.user.id }
      ]
    };

    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'fullName email')
      .populate('assignedTo', 'fullName email');

    const total = await Task.countDocuments(query);

    return res.json({
      success: true,
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching tasks', error: err.message });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user.id },
        { assignedTo: req.user.id }
      ]
    })
    .populate('userId', 'fullName email')
    .populate('assignedTo', 'fullName email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    return res.json({ success: true, task });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Not found' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const { title, description, completed, dueDate, assignedTo } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    // Validate assignedTo user exists if provided
    if (assignedTo !== undefined && assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const user = await User.findById(assignedTo);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await task.save();
    return res.json({ success: true, message: 'Task updated', task });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Not found' });
  }
};

// Mark task as completed
exports.completeTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user.id },
        { assignedTo: req.user.id }
      ]
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    task.completed = true;
    await task.save();
    return res.json({ success: true, message: 'Task marked as completed', task });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Not found' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    return res.json({ success: true, message: 'Task deleted', task });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Not found' });
  }
};
