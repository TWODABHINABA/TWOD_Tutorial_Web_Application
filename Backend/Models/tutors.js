const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  profilePicture: { type: String, default: null },
  description: { type: String, default: null },
  isFirstLogin: { type: Boolean, default: true },
  subjects: [{ type: String, default: null }],
  phone: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  resetOTP: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  role: {
    type: String,
    default: "tutor",
  },
  availability: [
    {
      date: { type: Date, required: true },
      subjects: [
        {
          subjectName: { type: String, required: true },
          timeSlots: [
            {
              startTime: { type: String, required: true },
              endTime: { type: String, required: true },
            },
          ],
        },
      ],
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

const Tutor = mongoose.model("Tutor", tutorSchema);
module.exports = Tutor;
