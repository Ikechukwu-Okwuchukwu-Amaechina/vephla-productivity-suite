require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStoreModule = require('connect-mongo');
const MongoStore = MongoStoreModule && MongoStoreModule.default ? MongoStoreModule.default : MongoStoreModule;
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));

// session persistence using MongoDB (skip store in test environment)
if (!process.env.SESSION_SECRET) {
	console.warn('SESSION_SECRET not set in .env');
}
let sessionStore;
if (process.env.NODE_ENV !== 'test') {
	sessionStore = (typeof MongoStore.create === 'function')
		? MongoStore.create({ mongoUrl: process.env.MONGO_URI })
		: // fallback for older/commonjs interop
			MongoStore({ mongoUrl: process.env.MONGO_URI });
}
const sessionOptions = {
	secret: process.env.SESSION_SECRET || 'change-me',
	resave: false,
	saveUninitialized: false,
	cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 }
};
if (process.env.NODE_ENV !== 'test' && sessionStore) sessionOptions.store = sessionStore;
app.use(session(sessionOptions));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/files', require('./routes/files'));
app.use('/api/messages', require('./routes/messages'));

app.get('/', (req, res) => res.json({ status: 'ok' }));


app.io = io;

// Socket.io connection handling
require('./services/socket')(io);

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		server.listen(port, () => console.log(`Server running on port ${port}`));
	} catch (err) {
		console.error('Failed to start', err);
		process.exit(1);
	}
};

if (require.main === module) {
	start();
}

module.exports = app;
