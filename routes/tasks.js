const express = require('express');
const router = express.Router();

// Tasks routes (stub)
router.get('/', (req, res) => res.status(501).json({ message: 'Not implemented' }));
router.post('/', (req, res) => res.status(501).json({ message: 'Not implemented' }));

module.exports = router;
