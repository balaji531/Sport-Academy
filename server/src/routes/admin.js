const router     = require('express').Router();
const User       = require('../models/User');
const Booking    = require('../models/Booking');
const Payment    = require('../models/Payment');
const Event      = require('../models/Event');
const Membership = require('../models/Membership');
const { auth, requireRole } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

// GET /api/admin/stats
router.get('/stats', auth, requireRole('admin'), async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalMembers,
      totalBookings,
      activeBookings,
      totalEvents,
      activeMembers,
      revenueAgg,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'member',  isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Event.countDocuments(),
      Membership.countDocuments({ status: 'active' }),
      Payment.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    // Recent bookings (last 7 days)
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const recentBookings = await Booking.countDocuments({ createdAt: { $gte: since } });

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const revenueByMonth = await Payment.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id:   { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalMembers,
      totalBookings,
      activeBookings,
      totalEvents,
      activeMembers,
      totalRevenue,
      recentBookings,
      revenueByMonth,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', auth, requireRole('admin'), async (req, res) => {
  try {
    const { search, role, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (role)   filter.role = role;
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    // Prevent password updates through this endpoint
    delete req.body.password;

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user._id))
      return res.status(400).json({ message: 'Cannot delete your own account' });

    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id/fee-status
router.put('/users/:id/fee-status', auth, requireRole('admin'), async (req, res) => {
  try {
    const { feeStatus, feeDueDate } = req.body;
    const updates = {};
    if (feeStatus)  updates.feeStatus  = feeStatus;
    if (feeDueDate) updates.feeDueDate = feeDueDate;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Notify the student about their fee status update
    if (feeStatus === 'overdue') {
      await createNotification(req.io, {
        userId:  user._id,
        title:   'Fee Payment Reminder 💰',
        message: `Your fee is overdue. Please make the payment at your earliest convenience.`,
        type:    'fee_reminder',
      });
    } else if (feeStatus === 'paid') {
      await createNotification(req.io, {
        userId:  user._id,
        title:   'Fee Payment Confirmed ✅',
        message: `Your fee payment has been recorded. Thank you!`,
        type:    'general',
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
