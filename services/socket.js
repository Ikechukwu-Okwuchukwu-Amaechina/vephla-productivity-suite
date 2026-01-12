// Track active users and their socket info
const activeUsers = new Map();
const chatRooms = new Map();

module.exports = (io) => {
	io.on('connection', (socket) => {
		console.log(`User connected: ${socket.id}`);

		// User joins with their ID
		socket.on('user:join', (userId) => {
			activeUsers.set(socket.id, { userId, socketId: socket.id });
			io.emit('users:active', Array.from(activeUsers.values()));
			console.log(`User ${userId} joined. Active users: ${activeUsers.size}`);
		});

		// Join a chat room
		socket.on('room:join', (roomId) => {
			socket.join(roomId);
			if (!chatRooms.has(roomId)) {
				chatRooms.set(roomId, []);
			}
			const room = chatRooms.get(roomId);
			room.push(socket.id);
			io.to(roomId).emit('message:notification', `User joined the chat room`);
			console.log(`Socket ${socket.id} joined room: ${roomId}`);
		});

		// Leave a chat room
		socket.on('room:leave', (roomId) => {
			socket.leave(roomId);
			const room = chatRooms.get(roomId);
			if (room) {
				chatRooms.set(roomId, room.filter(id => id !== socket.id));
			}
			io.to(roomId).emit('message:notification', `User left the chat room`);
		});

		// Send message in a room
		socket.on('message:send', (data) => {
			const { roomId, text, userName } = data;
			const messageData = {
				socketId: socket.id,
				userName: userName || 'Anonymous',
				text,
				timestamp: new Date()
			};
			// Broadcast to everyone in the room
			io.to(roomId).emit('message:received', messageData);
			console.log(`Message in room ${roomId}: ${text}`);
		});

		// Typing indicator
		socket.on('user:typing', (data) => {
			const { roomId, userName } = data;
			socket.to(roomId).emit('user:typing', { userName });
		});

		socket.on('user:stop-typing', (roomId) => {
			socket.to(roomId).emit('user:stop-typing');
		});

		// Notification: New note created
		socket.on('note:created', (noteData) => {
			io.emit('notification:note', {
				type: 'note_created',
				message: `New note created by ${noteData.createdBy}`,
				data: noteData,
				timestamp: new Date()
			});
		});

		// Notification: New task created
		socket.on('task:created', (taskData) => {
			io.emit('notification:task', {
				type: 'task_created',
				message: `New task created by ${taskData.createdBy}`,
				data: taskData,
				timestamp: new Date()
			});
		});

		// Notification: Task completed
		socket.on('task:completed', (taskData) => {
			io.emit('notification:task', {
				type: 'task_completed',
				message: `Task "${taskData.title}" marked as completed`,
				data: taskData,
				timestamp: new Date()
			});
		});

		// Disconnect handler
		socket.on('disconnect', () => {
			activeUsers.delete(socket.id);
			io.emit('users:active', Array.from(activeUsers.values()));
			console.log(`User disconnected: ${socket.id}. Active users: ${activeUsers.size}`);
		});

		socket.on('error', (error) => {
			console.error(`Socket error for ${socket.id}:`, error);
		});
	});
};
