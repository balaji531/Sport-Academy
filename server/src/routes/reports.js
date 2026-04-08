const router      = require('express').Router();
const User        = require('../models/User');
const Fee         = require('../models/Fee');
const Attendance  = require('../models/Attendance');
const Batch       = require('../models/Batch');
const Event       = require('../models/Event');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/reports/summary  — master summary
router.get('/summary', auth, requireRole('admin'), async (req, res) => {
  try {
    const [students, coaches, totalFees, pendingFees, overdueFees, totalBatches, events] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'admin',   isActive: true }),
      Fee.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Fee.aggregate([{ $match: { status: 'pending' } }, { $group: { _id: null, t: { $sum: '$totalAmount' } } }]),
      Fee.aggregate([{ $match: { status: 'overdue'  } }, { $group: { _id: null, t: { $sum: '$totalAmount' } } }]),
      Batch.countDocuments({ isActive: true }),
      Event.countDocuments(),
    ]);
    res.json({
      students,
      coaches,
      totalFees:   totalFees[0]?.total   || 0,
      pendingFees: pendingFees[0]?.t      || 0,
      overdueFees: overdueFees[0]?.t      || 0,
      activeBatches: totalBatches,
      events,
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/reports/fees  — fees collection report
router.get('/fees', auth, requireRole('admin'), async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to)   match.createdAt.$lte = new Date(to);
    }
    const data = await Fee.find(match).sort({ createdAt: -1 });
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/reports/students  — student list report
router.get('/students', auth, requireRole('admin'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isActive: true })
      .select('-password')
      .sort({ name: 1 });
    res.json(students);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/reports/batches  — batch utilisation
router.get('/batches', auth, requireRole('admin'), async (req, res) => {
  try {
    const batches = await Batch.find({ isActive: true }).sort({ name: 1 });
    const data = batches.map(b => ({
      name:       b.name,
      sport:      b.sport,
      capacity:   b.capacity,
      enrolled:   b.students.length,
      utilisation: b.capacity > 0 ? Math.round((b.students.length / b.capacity) * 100) : 0,
    }));
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
