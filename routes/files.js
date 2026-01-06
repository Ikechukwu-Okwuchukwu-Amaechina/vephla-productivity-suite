const express = require('express');
const router = express.Router();

// File upload/download routes (stub)
router.post('/upload', (req, res) => res.status(501).json({ message: 'Not implemented' }));
router.get('/download/:id', (req, res) => res.status(501).json({ message: 'Not implemented' }));

module.exports = router;
