
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "person", required: true },
  amount: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }, 
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor" }, // Added field
  selectedDate: { type: String }, // e.g., "2025-03-11"
  selectedTime: { type: String }, // e.g., "15:00"
  duration: { type: String }, // e.g., "1 hr"
  createdAt: { type: Date, default: Date.now }
});
const Transaction=mongoose.model("Transaction",TransactionSchema);
module.exports = Transaction;
