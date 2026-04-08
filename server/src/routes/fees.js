const router = require('express').Router();
const Fee    = require('../models/Fee');
const User   = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/fees  (admin: all, student: own)
router.get('/', auth, async (req, res) => {
  try {
    const { status, feeType, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (req.user.role !== 'admin') filter.student = req.user._id;
    if (status)  filter.status  = status;
    if (feeType) filter.feeType = feeType;
    if (search)  filter.studentName = { $regex: search, $options: 'i' };

    const [fees, total] = await Promise.all([
      Fee.find(filter).sort({ dueDate: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Fee.countDocuments(filter),
    ]);
    res.json({ fees, total });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/fees/summary  — totals for dashboard
router.get('/summary', auth, requireRole('admin'), async (req, res) => {
  try {
    const [pending, overdue, collected] = await Promise.all([
      Fee.aggregate([{ $match: { status: 'pending' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Fee.aggregate([{ $match: { status: 'overdue' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Fee.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$paidAmount' } } }]),
    ]);
    res.json({
      pendingTotal:   pending[0]?.total  || 0,
      overdueTotal:   overdue[0]?.total  || 0,
      collectedTotal: collected[0]?.total || 0,
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/fees
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    // Auto-populate student name
    if (req.body.student && !req.body.studentName) {
      const u = await User.findById(req.body.student).select('name');
      if (u) req.body.studentName = u.name;
    }
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// PUT /api/fees/:id
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!fee) return res.status(404).json({ message: 'Not found' });
    res.json(fee);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// DELETE /api/fees/:id
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await Fee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fee record deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
