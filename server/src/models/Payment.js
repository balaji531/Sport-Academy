const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount:      { type: Number, required: true },
    currency:    { type: String, default: 'INR' },
    type:        { type: String, enum: ['booking', 'membership', 'event', 'registration'], required: true },
    description: { type: String },
    referenceId: { type: String },   // booking/event/membership _id
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status:      { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
