const router  = require('express').Router();
const crypto  = require('crypto');
const Payment = require('../models/Payment');
const { auth, requireRole } = require('../middleware/auth');

// Lazy-load Razorpay so the server starts even without valid keys
const getRazorpay = () => {
  const Razorpay = require('razorpay');
  const key_id     = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || key_id === 'rzp_test_xxxxxxxxxxxx' || !key_secret || key_secret === 'your_razorpay_secret') {
    console.warn('⚠️  Razorpay keys not properly configured in .env. Order creation will fail.');
  }

  return new Razorpay({
    key_id:     key_id     || 'rzp_test_placeholder',
    key_secret: key_secret || 'placeholder_secret',
  });
};

// POST /api/payments/create-order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, type, description, referenceId } = req.body;
    if (!amount || !type) return res.status(400).json({ message: 'amount and type are required' });

    // Create a pending payment record first
    const payment = await Payment.create({
      user: req.user._id,
      amount,
      type,
      description,
      referenceId,
      status: 'created',
    });

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100),   // ensure integer paise
      currency: 'INR',
      receipt:  `rcpt_${payment._id}`,
    });
    
    payment.razorpayOrderId = order.id;
    await payment.save();

    res.json({ order, paymentId: payment._id });
  } catch (err) {
    console.error('❌ Razorpay Order Creation Error:', err.message);
    if (err.stack) console.error(err.stack);
    res.status(500).json({ message: `Payment Order Error: ${err.message}` });
  }
});

// POST /api/payments/verify
router.post('/verify', auth, async (req, res) => {
  try {
    const { paymentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ message: 'Razorpay secret not configured' });
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification details' });
    }

    const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected  = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (expected !== razorpay_signature) {
      payment.status = 'failed';
      await payment.save();
      return res.status(400).json({ message: 'Payment signature verification failed' });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status            = 'paid';
    await payment.save();

    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/history  (own history)
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/all  (admin)
router.get('/all', auth, requireRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    const filter = {};
    if (type)   filter.type   = type;
    if (status) filter.status = status;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Payment.countDocuments(filter),
    ]);
    res.json({ payments, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
