const mongoose = require("mongoose");

const payLaterSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  amount: { type: String, required: true },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tutor",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "person",  // note the change here to "person"
    required: true,
  },
  selectedDate: { type: String, required: true },
  selectedTime: { type: String, required: true },
  duration: { type: String, required: true },
  bonus: { type: String },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "pending for tutor acceptance", "completed", "failed"],
    default: "pending",
  },
}, { timestamps: true });

const PayLater=mongoose.model("PayLater", payLaterSchema);
module.exports = PayLater;