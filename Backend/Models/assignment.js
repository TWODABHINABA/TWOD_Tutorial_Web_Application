const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tutor",
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  courseType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  questions: [
    {
      text: { type: String, required: true },
      number: { type: Number, required: true }, // Could be marks or serial number
    },
  ],
}, {
  timestamps: true
});

const assignment=mongoose.model("assignment",assignmentSchema);
module.exports = assignment

