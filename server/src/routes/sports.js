const router = require('express').Router();
const Sport  = require('../models/Sport');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/sports
router.get('/', auth, async (req, res) => {
  try {
    const sports = await Sport.find({ isActive: true }).sort({ name: 1 });
    res.json(sports);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/sports
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const sport = await Sport.create(req.body);
    res.status(201).json(sport);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// PUT /api/sports/:id
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const sport = await Sport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sport) return res.status(404).json({ message: 'Not found' });
    res.json(sport);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// DELETE /api/sports/:id
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await Sport.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Sport deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
