const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    ageGroup:    { type: String, trim: true },          // e.g. "6-18 years"
    skillLevels: [{ type: String }],                    // ["Beginner", "Intermediate", "Advanced"]
    feeStructure:{ type: Number, default: 0 },          // monthly fee in INR
    duration:    { type: String },                      // e.g. "3 months"
    maxStudents: { type: Number, default: 30 },
    assignedCoaches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sport', sportSchema);
