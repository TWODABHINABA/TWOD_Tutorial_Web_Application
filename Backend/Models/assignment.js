const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tutor",
    required: true,
  },
  courseName: {
    type: String, // e.g., "Chemistry"
    required: true,
  },
  courseType: {
    type: String, // e.g., "Grade 10"
    required: true,
  },
  date: {
    type: String, // "2025-04-22"
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("assignment", assignmentSchema);
