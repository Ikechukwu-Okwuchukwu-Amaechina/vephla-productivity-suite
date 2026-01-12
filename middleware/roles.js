const logger = require('../utils/logger');

const permit = (...allowed) => (req, res, next) => {
  const role = req.user && req.user.role;
  logger.info('Checking role authorization', { role, allowed });
  if (!role) {
    logger.warn('No role found');
    return res.status(403).json({ message: 'Role required' });
  }
  if (allowed.includes(role)) {
    logger.info('Role authorized');
    return next();
  }
  logger.warn('Role not authorized', { role, required: allowed });
  return res.status(403).json({ message: 'Forbidden' });
};

module.exports = { permit };
