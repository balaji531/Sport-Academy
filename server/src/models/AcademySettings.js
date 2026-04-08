const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    academyName:      { type: String, default: 'Sport Faction Academy' },
    tagline:          { type: String, default: 'Excellence in Sports' },
    logo:             { type: String },
    email:            { type: String },
    phone:            { type: String },
    address:          { type: String },
    website:          { type: String },
    sportsOffered:    [{ type: String }],
    feeDefaults: {
      admissionFee:   { type: Number, default: 0 },
      monthlyFee:     { type: Number, default: 0 },
      lateFeeCharge:  { type: Number, default: 0 },
      dueDayOfMonth:  { type: Number, default: 5 },
    },
    notificationSettings: {
      sendFeeReminders:    { type: Boolean, default: true },
      sendEventAlerts:     { type: Boolean, default: true },
      reminderDaysBefore:  { type: Number, default: 3 },
    },
    paymentGateway: {
      provider:  { type: String, default: 'razorpay' },
      keyId:     { type: String },
      isLive:    { type: Boolean, default: false },
    },
    singleton: { type: Boolean, default: true, unique: true },  // Ensures only one settings doc
  },
  { timestamps: true }
);

module.exports = mongoose.model('AcademySettings', settingsSchema);
