const router          = require('express').Router();
const AcademySettings = require('../models/AcademySettings');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/settings
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    let settings = await AcademySettings.findOne();
    if (!settings) settings = await AcademySettings.create({});
    res.json(settings);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/settings
router.put('/', auth, requireRole('admin'), async (req, res) => {
  try {
    let settings = await AcademySettings.findOne();
    if (!settings) {
      settings = await AcademySettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json(settings);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;
