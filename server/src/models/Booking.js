const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sport:       { type: String, enum: ['badminton', 'skating', 'pickleball'], required: true },
    type:        { type: String, enum: ['court', 'coach'], required: true },
    date:        { type: String, required: true },   // 'YYYY-MM-DD'
    timeSlot:    { type: String, required: true },
    courtNumber: { type: Number, default: 1 },
    coachName:   { type: String },
    notes:       { type: String },
    amount:      { type: Number, required: true },
    status:      { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    paymentId:   { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
