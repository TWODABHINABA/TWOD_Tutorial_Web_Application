const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true ,unique:true},
  profilePicture: { type: String },
  description: { type: String, required: true },
  availability: [
    {
      date: String,
      timeSlots: [String]
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Tutor = mongoose.model("Tutor", tutorSchema);
module.exports = Tutor;
