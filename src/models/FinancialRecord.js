const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Type is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    index: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    index: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient filtering
financialRecordSchema.index({ userId: 1, date: -1 });
financialRecordSchema.index({ userId: 1, type: 1, category: 1 });
financialRecordSchema.index({ userId: 1, isDeleted: 1 });

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);
