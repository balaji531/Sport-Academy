const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true },
    description:  { type: String },
    sport:        { type: String, enum: ['badminton', 'skating', 'pickleball'], required: true },
    date:         { type: Date, required: true },
    location:     { type: String },
    maxParticipants: { type: Number, default: 50 },
    entryFee:     { type: Number, default: 0 },
    prizes:       [{ place: String, reward: String }],
    enrolledUsers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    gallery:      [{ url: String, caption: String }],
    status:       { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
    createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
