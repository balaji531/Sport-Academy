const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone:    { type: String, trim: true },
    role:     { type: String, enum: ['student', 'member', 'admin', 'coach'], default: 'student' },
    sport:    { type: String, enum: ['badminton', 'skating', 'pickleball', 'multiple', ''], default: '' },

    // Student-specific
    batch:        { type: String },
    coachName:    { type: String },
    admissionDate:{ type: Date, default: Date.now },
    feeStatus:    { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
    feeDueDate:   { type: Date },

    // Member-specific
    membershipPlan:   { type: String, enum: ['basic', 'standard', 'premium', 'elite', ''], default: '' },
    membershipExpiry: { type: Date },

    avatar:   { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Strip password from JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
