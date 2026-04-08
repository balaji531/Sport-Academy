const router     = require('express').Router();
const Attendance = require('../models/Attendance');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/attendance/my  (student)
router.get('/my', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { student: req.user._id };

    if (month && year) {
      const start = `${year}-${String(month).padStart(2, '0')}-01`;
      const end   = `${year}-${String(month).padStart(2, '0')}-31`;
      filter.date = { $gte: start, $lte: end };
    }

    const records = await Attendance.find(filter)
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    const total   = records.length;
    const present = records.filter((r) => r.present).length;

    res.json({ records, stats: { total, present, absent: total - present, percentage: total ? Math.round((present / total) * 100) : 0 } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/attendance/student/:id  (admin)
router.get('/student/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.id })
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    const total   = records.length;
    const present = records.filter((r) => r.present).length;

    res.json({ records, stats: { total, present, absent: total - present, percentage: total ? Math.round((present / total) * 100) : 0 } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/attendance  (admin)
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const { student, date, sport, batch, present = true, notes } = req.body;
    if (!student || !date) return res.status(400).json({ message: 'student and date are required' });

    const record = await Attendance.findOneAndUpdate(
      { student, date },
      { student, date, sport, batch, present, notes, markedBy: req.user._id },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json(record);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Attendance already marked for this date' });
    }
    res.status(500).json({ message: err.message });
  }
});

// POST /api/attendance/bulk  (admin — mark multiple students at once)
router.post('/bulk', auth, requireRole('admin'), async (req, res) => {
  try {
    const { records, date, sport, batch } = req.body;
    // records: [{ student, present }]
    if (!Array.isArray(records) || !date) return res.status(400).json({ message: 'records array and date required' });

    const ops = records.map(({ student, present = true }) => ({
      updateOne: {
        filter: { student, date },
        update: { $set: { student, date, sport, batch, present, markedBy: req.user._id } },
        upsert: true,
      },
    }));

    const result = await Attendance.bulkWrite(ops);
    res.json({ message: 'Bulk attendance recorded', result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
