const router  = require('express').Router();
const Booking = require('../models/Booking');
const { auth, requireRole } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

// GET /api/bookings/availability?sport=&date=
router.get('/availability', async (req, res) => {
  try {
    const { sport, date } = req.query;
    if (!sport || !date) return res.status(400).json({ message: 'sport and date required' });
    const bookings = await Booking.find({ sport, date, status: { $ne: 'cancelled' } })
      .select('timeSlot courtNumber');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/my  (authenticated)
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/all  (admin)
router.get('/all', auth, requireRole('admin'), async (req, res) => {
  try {
    const { sport, status, date, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (sport)  filter.sport  = sport;
    if (status) filter.status = status;
    if (date)   filter.date   = date;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Booking.countDocuments(filter),
    ]);
    res.json({ bookings, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bookings  (authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const { sport, type, date, timeSlot, courtNumber, coachName, notes, amount } = req.body;

    // Check for conflicts
    const conflict = await Booking.findOne({ sport, date, timeSlot, courtNumber, status: { $ne: 'cancelled' } });
    if (conflict) return res.status(409).json({ message: 'This slot is already booked' });

    const booking = await Booking.create({
      user: req.user._id, sport, type, date, timeSlot,
      courtNumber: courtNumber || 1, coachName, notes, amount,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bookings/:id/confirm
router.put('/:id/confirm', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status    = 'confirmed';
    booking.paymentId = req.body.paymentId;
    await booking.save();

    await createNotification(req.io, {
      userId:  req.user._id,
      title:   'Booking Confirmed ✅',
      message: `Your ${booking.sport} ${booking.type} booking on ${booking.date} at ${booking.timeSlot} is confirmed.`,
      type:    'booking_confirmed',
      link:    '/bookings',
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user._id };

    const booking = await Booking.findOne(filter);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();

    await createNotification(req.io, {
      userId:  booking.user,
      title:   'Booking Cancelled',
      message: `Your ${booking.sport} booking on ${booking.date} at ${booking.timeSlot} has been cancelled.`,
      type:    'booking_cancelled',
      link:    '/bookings',
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
