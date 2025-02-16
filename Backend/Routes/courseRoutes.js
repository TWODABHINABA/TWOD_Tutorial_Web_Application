const express = require("express");
const router = express.Router();
const Course = require("../Models/course");
const authMiddleware = require("../Auth/Authentication");

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      overview,
      description,
      curriculum,
      price,
      discountPrice,
      duration,
      instructor,
      level,
    } = req.body;

    const newCourse = new Course({
      name,
      overview,
      description,
      curriculum,
      price,
      discountPrice,
      duration,
      instructor,
      level,
      feedbacks: [],
    });

    await newCourse.save();
    res
      .status(201)
      .json({ message: "Course added successfully", course: newCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/feedback",authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const feedback = {
      user: req.user.id,
      name: req.user.name,
      profilePicture: req.user.profilePicture,
      rating,
      comment,
    };

    course.feedbacks.push(feedback);
    await course.save();

    res.json({ message: "Feedback added successfully", course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/courses/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("feedbacks.user", "name");
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/courses",authMiddleware,  async (req, res) => {
  // try {
  //   const course = await Course.findById(req.params.id).populate("feedbacks.user", "name");;

  //   if (!course) {
  //     return res.status(404).json({ message: "Course not found" });
  //   }

  //   res.json(course);
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
  try {
    const { name } = req.query; // Get course name from query params

    if (!name) {
      return res.status(400).json({ message: "Course name is required" });
    }

    // Find a course with the given name (case-insensitive)
    const course = await Course.findOne({ name: new RegExp(`^${name}$`, "i") });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    console.log(course);
    res.json(course); // Send the full course object, frontend will extract `_id`
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
