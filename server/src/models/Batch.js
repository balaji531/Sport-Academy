const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    sport:        { type: String, required: true },
    ageGroup:     { type: String },
    skillLevel:   { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All'], default: 'All' },
    timeSlot:     { type: String },           // e.g. "6:00 AM – 7:30 AM"
    days:         [{ type: String }],         // ["Mon", "Wed", "Fri"]
    capacity:     { type: Number, default: 20 },
    coach:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coachName:    { type: String },
    venue:        { type: String },
    startDate:    { type: Date },
    endDate:      { type: Date },
    students:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Batch', batchSchema);
