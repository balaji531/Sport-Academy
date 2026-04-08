const router  = require('express').Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { auth } = require('../middleware/auth');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, sport } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Email already in use' });

    // Only allow student self-registration
    const assignedRole = 'student';

    const user  = await User.create({ name, email, password, phone, role: assignedRole, sport });
    const token = signToken(user._id);

    res.status(201).json({ ...user.toJSON(), token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isActive)
      return res.status(403).json({ message: 'Account is deactivated' });

    const token = signToken(user._id);
    res.json({ ...user.toJSON(), token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => res.json(req.user));

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'sport', 'avatar'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    if (req.body.password) {
      const bcrypt = require('bcryptjs');
      updates.password = await bcrypt.hash(req.body.password, 12);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
