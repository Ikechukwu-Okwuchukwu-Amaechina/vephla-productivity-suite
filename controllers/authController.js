const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) return res.status(400).json({ success: false, message: 'Full name, email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashed, role });
    await user.save();

    return res.status(201).json({ success: true, message: 'User created' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // create session
    req.session.userId = user._id;
    req.session.role = user.role;

    return res.json({ success: true, token, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { register, login };
