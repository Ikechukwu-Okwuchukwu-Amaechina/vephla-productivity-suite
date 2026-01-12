const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const verifyToken = (req, res, next) => {
  logger.info('Verifying token', { method: req.method, path: req.path });
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    logger.warn('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    logger.info('Token verified', { userId: payload.id });
    req.user = payload;
    next();
  } catch (err) {
    logger.error('Invalid token', { error: err.message });
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };
