// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  amount: { type: String, required: true },
  status: { type: String, default: 'pending' }, // pending, completed, or cancelled
  createdAt: { type: Date, default: Date.now },
  paymentId: { type: String }, // Will be set after payment creation/execution
  payerId: { type: String }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
