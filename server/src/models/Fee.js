const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    student:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentName:   { type: String },
    batch:         { type: String },
    sport:         { type: String },
    feeType:       { type: String, enum: ['admission', 'monthly', 'quarterly', 'coaching', 'tournament', 'other'], default: 'monthly' },
    dueDate:       { type: Date },
    totalAmount:   { type: Number, default: 0 },
    paidAmount:    { type: Number, default: 0 },
    discount:      { type: Number, default: 0 },
    status:        { type: String, enum: ['paid', 'pending', 'overdue', 'partial'], default: 'pending' },
    paymentMode:   { type: String, enum: ['cash', 'online', 'upi', 'card', 'cheque', ''], default: '' },
    paymentDate:   { type: Date },
    receiptNo:     { type: String },
    notes:         { type: String },
  },
  { timestamps: true }
);

// Auto-generate receipt number
feeSchema.pre('save', async function (next) {
  if (!this.receiptNo) {
    const count = await mongoose.model('Fee').countDocuments();
    this.receiptNo = `SF-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Fee', feeSchema);
