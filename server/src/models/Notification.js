const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    type:    { type: String, enum: ['general', 'booking_confirmed', 'booking_cancelled', 'fee_reminder', 'event', 'membership'], default: 'general' },
    read:    { type: Boolean, default: false },
    link:    { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
