const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan:      { type: String, enum: ['basic', 'standard', 'premium', 'elite'], required: true },
    startDate: { type: Date, default: Date.now },
    expiryDate:{ type: Date, required: true },
    paymentId: { type: String },
    status:    { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Membership', membershipSchema);
