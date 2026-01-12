const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// In-memory message store (for demonstration)
let messages = [];

// Get messages from a specific room
router.get('/room/:roomId', verifyToken, (req, res) => {
	const { roomId } = req.params;
	const roomMessages = messages.filter(m => m.roomId === roomId);
	res.json(roomMessages);
});

// Send a message via API (optional - clients can also use Socket.io)
router.post('/', verifyToken, (req, res) => {
	const { roomId, text } = req.body;

	if (!roomId || !text) {
		return res.status(400).json({ error: 'roomId and text are required' });
	}

	const message = {
		id: Date.now().toString(),
		roomId,
		userId: req.user.id,
		userName: req.user.name || 'Anonymous',
		text,
		timestamp: new Date()
	};

	messages.push(message);

	// Emit via Socket.io if io is available
	if (req.app.io) {
		req.app.io.to(roomId).emit('message:received', message);
	}

	res.status(201).json(message);
});

// Clear messages for a room (admin only - optional)
router.delete('/room/:roomId', verifyToken, (req, res) => {
	const { roomId } = req.params;
	messages = messages.filter(m => m.roomId !== roomId);
	res.json({ success: true, message: `Messages in room ${roomId} cleared` });
});

module.exports = router;
