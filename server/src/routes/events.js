const router  = require('express').Router();
const path    = require('path');
const multer  = require('multer');
const Event   = require('../models/Event');
const { auth, requireRole } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');
const User    = require('../models/User');

// ─── Multer setup ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const { sport, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (sport)  filter.sport  = sport;
    if (status) filter.status = status;

    const events = await Event.find(filter)
      .populate('createdBy', 'name')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('enrolledUsers', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events  (admin)
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });

    // Notify all users about new event
    const users = await User.find({ isActive: true }, '_id');
    await Promise.all(
      users.map((u) =>
        createNotification(req.io, {
          userId:  u._id,
          title:   `New Event: ${event.title}`,
          message: `A new ${event.sport} event has been added on ${new Date(event.date).toDateString()}.`,
          type:    'event',
          link:    '/events',
        })
      )
    );

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/events/:id  (admin)
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/events/:id  (admin)
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events/:id/enroll  (authenticated)
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.enrolledUsers.includes(req.user._id))
      return res.status(409).json({ message: 'Already enrolled' });

    if (event.enrolledUsers.length >= event.maxParticipants)
      return res.status(400).json({ message: 'Event is full' });

    event.enrolledUsers.push(req.user._id);
    await event.save();

    await createNotification(req.io, {
      userId:  req.user._id,
      title:   'Event Enrollment Confirmed 🎉',
      message: `You are enrolled in ${event.title} on ${new Date(event.date).toDateString()}.`,
      type:    'event',
      link:    '/events',
    });

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events/:id/gallery  (admin — multipart)
router.post('/:id/gallery', auth, requireRole('admin'), upload.array('images', 10), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const newImages = req.files.map((f) => ({
      url:     `/uploads/${f.filename}`,
      caption: '',
    }));
    event.gallery.push(...newImages);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
