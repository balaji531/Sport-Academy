const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema(
  {
    student:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentName:   { type: String },
    sport:         { type: String },
    coach:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coachName:     { type: String },
    month:         { type: Number },   // 1–12
    year:          { type: Number },
    // Core metrics (0–10 scale)
    metrics: {
      footwork:       { type: Number, default: 0 },
      serveAccuracy:  { type: Number, default: 0 },
      smashControl:   { type: Number, default: 0 },
      stamina:        { type: Number, default: 0 },
      discipline:     { type: Number, default: 0 },
      fitness:        { type: Number, default: 0 },
      teamwork:       { type: Number, default: 0 },
    },
    overallRating:   { type: Number, default: 0 },   // computed average
    coachFeedback:   { type: String },
    achievements:    [{ type: String }],
    weaknessAreas:   [{ type: String }],
    matchStats: {
      played:  { type: Number, default: 0 },
      won:     { type: Number, default: 0 },
      lost:    { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Performance', performanceSchema);
