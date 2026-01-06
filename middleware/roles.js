const permit = (...allowed) => (req, res, next) => {
  const role = req.user && req.user.role;
  if (!role) return res.status(403).json({ message: 'Role required' });
  if (allowed.includes(role)) return next();
  return res.status(403).json({ message: 'Forbidden' });
};

module.exports = { permit };
