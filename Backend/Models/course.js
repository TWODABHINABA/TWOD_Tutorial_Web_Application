const mongoose = require("mongoose");
const { type } = require("os");


const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "person" },
  name: String,
  profilePicture: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const CurriculumSchema = new mongoose.Schema({
  sectionTitle: String,
  lessons: [
    {
      title: String,
      duration: String,
    },
  ],
  quiz: String,
});

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  overview: { type: String, required: true },
  description:{type: String},
  curriculum: [CurriculumSchema], // Array of curriculum sections
  price: { type: String, required: true },
  discountPrice: { type: String, },
  duration: String, // e.g., "15 hours"
  instructor: String,
  level: String, // Beginner, Intermediate, Advanced
  feedbacks: [FeedbackSchema],
  createdAt: { type: Date, default: Date.now },
});
const course = mongoose.model("course", courseSchema);
module.exports = course;
