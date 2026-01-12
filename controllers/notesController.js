const Note = require('../models/Note');
const logger = require('../utils/logger');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    logger.info('Creating note', { userId: req.user?.id });
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
      logger.warn('Missing title or content in note creation');
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: req.user.id
    });

    await note.save();
    logger.info('Note created successfully', { noteId: note._id, userId: req.user.id });
    
    // Emit Socket.io notification
    if (req.app.io) {
      req.app.io.emit('notification:note', {
        type: 'note_created',
        message: `New note created: "${note.title}"`,
        noteId: note._id,
        userId: req.user.id,
        title: note.title,
        timestamp: new Date()
      });
    }
    
    return res.status(201).json({ success: true, message: 'Note created', note });
  } catch (err) {
    logger.error('Error creating note', { error: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: 'Error creating note', error: err.message });
  }
};

// Get all notes for the current user with optional filtering
exports.getNotes = async (req, res) => {
  try {
    const { tag, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { userId: req.user.id };
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Note.countDocuments(query);

    return res.json({
      success: true,
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching notes', error: err.message });
  }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    return res.json({ success: true, note });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching note', error: err.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;

    await note.save();
    return res.json({ success: true, message: 'Note updated', note });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating note', error: err.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    return res.json({ success: true, message: 'Note deleted', note });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting note', error: err.message });
  }
};
