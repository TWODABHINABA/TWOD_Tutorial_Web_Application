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
  courseType: { type: String},
  name: { type: String, required: true},
  overview: { type: String, required: true },
  description:{type: String},
  curriculum: [CurriculumSchema], 
  price: { type: String, required: true },
  discountPrice: { type: String, },
  duration: String, 
  instructor: String,
  level: String, 
  feedbacks: [FeedbackSchema],
  createdAt: { type: Date, default: Date.now },
});
const course = mongoose.model("course", courseSchema);
module.exports = course;
