const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Note = require('../models/Note');
const Task = require('../models/Task');
const File = require('../models/File');


router.use(verifyToken);
router.use(verifyAdmin);

// GET All Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// GET All Notes
router.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// GET All Tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// GET All Files
router.get('/files', async (req, res) => {
    try {
        const files = await File.find().populate('userId', 'fullName email').sort({ uploadedAt: -1 });
        res.json(files);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const [usersCount, notesCount, tasksCount, filesCount] = await Promise.all([
            User.countDocuments(),
            Note.countDocuments(),
            Task.countDocuments(),
            File.countDocuments()
        ]);
        res.json({ users: usersCount, notes: notesCount, tasks: tasksCount, files: filesCount });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
