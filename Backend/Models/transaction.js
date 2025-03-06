// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  // courseId: { type: String, required: true },
  // amount: { type: String, required: true },
  // status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }, 
  // createdAt: { type: Date, default: Date.now },
  // paymentId: { type: String }, // Will be set after payment creation/execution
  // payerId: { type: String }

  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "person", required: true },
  amount: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }, 
  createdAt: { type: Date, default: Date.now }
});
const Transaction=mongoose.model("Transaction",TransactionSchema);
module.exports = Transaction;
