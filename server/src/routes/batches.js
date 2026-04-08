const router = require('express').Router();
const Batch  = require('../models/Batch');
const User   = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/batches
router.get('/', auth, async (req, res) => {
  try {
    const { sport, isActive } = req.query;
    const filter = {};
    if (sport)    filter.sport = sport;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    const batches = await Batch.find(filter).sort({ name: 1 });
    res.json(batches);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/batches/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate('students', 'name email studentId feeStatus');
    if (!batch) return res.status(404).json({ message: 'Not found' });
    res.json(batch);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/batches
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// PUT /api/batches/:id
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!batch) return res.status(404).json({ message: 'Not found' });
    res.json(batch);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// DELETE /api/batches/:id
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ message: 'Batch deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/batches/:id/add-student
router.post('/:id/add-student', auth, requireRole('admin'), async (req, res) => {
  try {
    const { studentId } = req.body;
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    if (!batch.students.includes(studentId)) batch.students.push(studentId);
    await batch.save();
    res.json(batch);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// DELETE /api/batches/:id/remove-student/:studentId
router.delete('/:id/remove-student/:studentId', auth, requireRole('admin'), async (req, res) => {
  try {
    await Batch.findByIdAndUpdate(req.params.id, { $pull: { students: req.params.studentId } });
    res.json({ message: 'Student removed' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
