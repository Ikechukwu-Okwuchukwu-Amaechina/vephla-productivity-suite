const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require('../controllers/notesController');

// All routes require authentication
router.use(verifyToken);

// Create a note
router.post('/', createNote);

// Get all notes (with optional filtering and pagination)
router.get('/', getNotes);

// Get a specific note
router.get('/:id', getNoteById);

// Update a note
router.put('/:id', updateNote);

// Delete a note
router.delete('/:id', deleteNote);

module.exports = router;
