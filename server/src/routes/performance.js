const router      = require('express').Router();
const Performance = require('../models/Performance');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/performance  — admin: all, student: own
router.get('/', auth, async (req, res) => {
  try {
    const { studentId, sport, month, year } = req.query;
    const filter = {};
    if (req.user.role !== 'admin') filter.student = req.user._id;
    if (studentId) filter.student = studentId;
    if (sport)  filter.sport = sport;
    if (month)  filter.month = Number(month);
    if (year)   filter.year  = Number(year);
    const records = await Performance.find(filter).sort({ year: -1, month: -1 });
    res.json(records);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/performance
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const m = req.body.metrics || {};
    const vals = Object.values(m).filter(v => typeof v === 'number');
    req.body.overallRating = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
    const record = await Performance.create(req.body);
    res.status(201).json(record);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// PUT /api/performance/:id
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    if (req.body.metrics) {
      const vals = Object.values(req.body.metrics).filter(v => typeof v === 'number');
      req.body.overallRating = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
    }
    const record = await Performance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json(record);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// DELETE /api/performance/:id
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await Performance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
