const router        = require('express').Router();
const InventoryItem = require('../models/InventoryItem');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/inventory
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const { category, lowStock } = req.query;
    const filter = {};
    if (category) filter.category = category;
    let items = await InventoryItem.find(filter).sort({ name: 1 });
    if (lowStock === 'true') items = items.filter(i => i.quantity <= i.lowStockThreshold);
    res.json(items);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/inventory
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const item = await InventoryItem.create(req.body);
    res.status(201).json(item);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// PUT /api/inventory/:id
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// DELETE /api/inventory/:id
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
