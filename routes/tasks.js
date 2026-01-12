const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  completeTask,
  deleteTask
} = require('../controllers/tasksController');

// All routes require authentication
router.use(verifyToken);

// Create a task
router.post('/', createTask);

// Get all tasks (with optional filtering and pagination)
router.get('/', getTasks);

// Get a specific task
router.get('/:id', getTaskById);

// Update a task
router.put('/:id', updateTask);

// Mark task as completed
router.patch('/:id/complete', completeTask);

// Delete a task
router.delete('/:id', deleteTask);

module.exports = router;
