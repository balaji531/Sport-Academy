const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    name:               { type: String, required: true, trim: true },
    category:           { type: String, enum: ['shuttlecock', 'racket', 'ball', 'net', 'jersey', 'cone', 'fitness', 'other'], default: 'other' },
    quantity:           { type: Number, default: 0 },
    damagedQty:         { type: Number, default: 0 },
    lowStockThreshold:  { type: Number, default: 5 },
    issuedTo:           { type: String },   // Coach name or Batch name
    purchaseDate:       { type: Date },
    purchasePrice:      { type: Number, default: 0 },
    vendor:             { type: String },
    notes:              { type: String },
  },
  { timestamps: true }
);

// Virtual: available quantity
inventorySchema.virtual('availableQty').get(function () {
  return this.quantity - this.damagedQty;
});

// Virtual: isLowStock
inventorySchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.lowStockThreshold;
});

inventorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('InventoryItem', inventorySchema);
