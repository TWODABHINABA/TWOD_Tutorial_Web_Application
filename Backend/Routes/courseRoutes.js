const express = require("express");
const router = express.Router();
const Course = require("../Models/course");
const authMiddleware = require("../Auth/Authentication");
// const adminAuth=require("../Admin/AdminAuth");

router.post("/add", authMiddleware, async (req, res) => {
  console.log("Role", req.user.role);
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only the admin can add courses!" });
  }

  try {
    const { courseType, name, overview, description, curriculum, price, discountPrice, duration, level } = req.body;

  
    // const existingCourse = await Course.findOne({ name, courseType });
    // if (existingCourse) {
    //   return res.status(400).json({ message: "Course with this name already exists in this category!" });
    // }

    const newCourse = new Course({
      courseType,
      name,
      overview,
      description,
      curriculum,
      price,
      discountPrice,
      duration,
      instructor: req.user.name,
      level,
      feedbacks: [],
    });

    await newCourse.save();
    res.status(201).json({ message: "Course added successfully", course: newCourse });
    console.log(newCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/feedback", authMiddleware, async (req, res) => {
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
    const course = await Course.findById(req.params.id).populate(
      "feedbacks.user",
      "name"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/allCourses", authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses from MongoDB
    res.json(courses); // Send all courses as JSON
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

router.get("/courses", authMiddleware, async (req, res) => {
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

// router.get("/category", authMiddleware, async (req, res) => {
//   const { courseType } = req.query;
//   if (!courseType) {
//     return res.status(400).json({ message: "Course name is required" });
//   }
//   try {
//     const course = await Course.findOne({ courseType: new RegExp(`^${courseType}$`, "i") });

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     console.log(course);
//     res.json(course);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// try {
//   const { name } = req.query; // Get course name from query params

//   if (!name) {
//     return res.status(400).json({ message: "Course name is required" });
//   }

//   // Find a course with the given name (case-insensitive)
//   const course = await Course.findOne({ name: new RegExp(`^${name}$`, "i") });

//   if (!course) {
//     return res.status(404).json({ message: "Course not found" });
//   }
//   console.log(course);
//   res.json(course); // Send the full course object, frontend will extract `_id`
// } catch (error) {
//   res.status(500).json({ error: error.message });
// }
// });

router.get("/categories", async (req, res) => {
  try {
    const categories = await Course.aggregate([
      {
        $group: {
          _id: "$courseType", // Group by courseType
          courses: { $push: "$name" }, // Collect course names
        },
      },
    ]);

    // Format response
    const formattedCategories = categories.map((cat) => ({
      category: cat._id, // courseType as category name
      courses: cat.courses, // List of courses under this category
    }));

    res.json(formattedCategories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});
module.exports = router;
