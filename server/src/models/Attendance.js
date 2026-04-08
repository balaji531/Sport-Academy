const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date:     { type: String, required: true },   // 'YYYY-MM-DD'
    sport:    { type: String },
    batch:    { type: String },
    present:  { type: Boolean, default: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes:    { type: String },
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
