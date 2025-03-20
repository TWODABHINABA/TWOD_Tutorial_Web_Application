
const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  description: { type: String, required: true },
  subjects: [{ type: String, required: true }], // Filter tutors by subjects
  availability: [
    {
      date: { type: Date, required: true },
      timeSlots: [
        {
          startTime: { type: String, required: true }, // Ensure time is provided
          endTime: { type: String, required: true },
        }
      ],
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Tutor = mongoose.model("Tutor", tutorSchema);
module.exports = Tutor;
