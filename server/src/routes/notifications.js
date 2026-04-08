const router       = require('express').Router();
const Notification = require('../models/Notification');
const User         = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

// GET /api/notifications/my
router.get('/my', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/notifications/send  (admin — broadcast)
router.post('/send', auth, requireRole('admin'), async (req, res) => {
  try {
    const { title, message, type = 'general', userIds } = req.body;
    if (!title || !message) return res.status(400).json({ message: 'title and message are required' });

    let targetUsers = [];

    if (userIds === 'all') {
      targetUsers = await User.find({ isActive: true }, '_id');
    } else if (Array.isArray(userIds) && userIds.length > 0) {
      targetUsers = userIds.map((id) => ({ _id: id }));
    } else {
      return res.status(400).json({ message: 'userIds must be "all" or an array of IDs' });
    }

    await Promise.all(
      targetUsers.map((u) =>
        createNotification(req.io, { userId: u._id, title, message, type })
      )
    );

    res.json({ message: `Notification sent to ${targetUsers.length} user(s)` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
