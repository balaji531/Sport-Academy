const router     = require('express').Router();
const Membership = require('../models/Membership');
const User       = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

// Membership plan definitions (single source of truth)
const PLANS = {
  basic: {
    price:    999,
    duration: 30,   // days
    features: ['Access to 1 sport', 'Court booking (2/week)', 'Locker access', 'Basic equipment'],
  },
  standard: {
    price:    1999,
    duration: 30,
    features: ['Access to 2 sports', 'Court booking (5/week)', 'Locker access', 'Equipment rental', 'Guest passes (1/month)'],
  },
  premium: {
    price:    3499,
    duration: 30,
    features: ['All sports access', 'Unlimited court booking', 'Personal locker', 'Free equipment rental', 'Guest passes (3/month)', '10% coaching discount'],
  },
  elite: {
    price:    5999,
    duration: 30,
    features: ['All sports access', 'Priority court booking', 'Premium locker', 'Free equipment', 'Guest passes (5/month)', 'Free coaching (2hr/week)', 'Nutrition consultation', 'Event priority registration'],
  },
};

// GET /api/memberships/plans  (public)
router.get('/plans', (_req, res) => res.json(PLANS));

// GET /api/memberships/my  (authenticated)
router.get('/my', auth, async (req, res) => {
  try {
    const membership = await Membership.findOne({ user: req.user._id, status: 'active' }).sort({ createdAt: -1 });
    res.json(membership);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/memberships/all  (admin)
router.get('/all', auth, requireRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const [memberships, total] = await Promise.all([
      Membership.find(filter)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Membership.countDocuments(filter),
    ]);
    res.json({ memberships, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/memberships/purchase  (authenticated)
router.post('/purchase', auth, async (req, res) => {
  try {
    const { plan, paymentId } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: 'Invalid plan' });

    const planData   = PLANS[plan];
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + planData.duration);

    // Cancel any existing active membership
    await Membership.updateMany({ user: req.user._id, status: 'active' }, { status: 'cancelled' });

    const membership = await Membership.create({
      user:       req.user._id,
      plan,
      expiryDate,
      paymentId,
      status:     'active',
    });

    // Update user profile
    await User.findByIdAndUpdate(req.user._id, {
      membershipPlan:   plan,
      membershipExpiry: expiryDate,
      role:             'member',
    });

    await createNotification(req.io, {
      userId:  req.user._id,
      title:   `${plan.charAt(0).toUpperCase() + plan.slice(1)} Membership Activated 🎉`,
      message: `Your ${plan} membership is active until ${expiryDate.toDateString()}.`,
      type:    'membership',
      link:    '/membership',
    });

    res.status(201).json(membership);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
