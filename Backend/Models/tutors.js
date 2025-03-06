const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profilePicture: { type: String },
  description: { type: String, required: true },
  availability: [
    {
      date: { type: String, required: true }, 
      timeSlots: [{ type: String, required: true }], 
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Tutor = mongoose.model("Tutor", tutorSchema);
module.exports = Tutor;
