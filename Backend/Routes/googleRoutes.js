const express = require("express");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Course = require("../Models/course");
const Tutor = require("../Models/tutors");
const router = express.Router();
// const { genAI } = require("../config/gemini");
const session = require("../Auth/Authentication");

const genAI = new GoogleGenerativeAI("AIzaSyCGpoyzO4bvzea1s9NA0R847e2vC7ofemY");

// router.post("/recommend", async (req, res) => {
//   try {
//     const { interests, researchField, strengths } = req.body;

//     let courses = await Course.find(
//       {
//         $or: [
//           { category: { $regex: interests, $options: "i" } },
//           { description: { $regex: researchField, $options: "i" } },
//           { tags: { $in: Array.isArray(strengths) ? strengths : [strengths] } },
//         ],
//       },
//       { name: 1, courseType: 1, _id: 1 }
//     );

//     if (courses.length === 0) {
//       courses = await Course.find({}, { name: 1, courseType: 1, _id: 1 }).limit(
//         5
//       );
//     }

//     const courseList = courses
//       .map(
//         (course, index) =>
//           `${index + 1}. **${course.name}** - ${
//             course.courseType || "Category Not Available"
//           }`
//       )
//       .join("\n");

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//     const prompt = `
//           You are a course recommendation assistant for an online learning platform.
//           A user is looking for courses based on:
//           - Interests: ${interests}
//           - Research Field: ${researchField}
//           - Strengths: ${strengths}

//           Here are some available courses from the database:
//           ${courseList}

//           Your task: Recommend the **5-10 most relevant courses** from the above list.
//           - Only use courses from the provided list.
//           - Mention **only the course name and course type**.
//           - Keep it **clear and structured**.

//           **Example format for response:**
//           1. **Grade 10 Math** - Math
//           2. **Organic Chemistry Basics** - Chemistry
//         `;

//     const result = await model.generateContent({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     const aiReply =
//       result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "Here are some general courses you might be interested in.";

//     res.json({ reply: aiReply, courses });
//   } catch (error) {
//     console.error("Error in recommendation:", error);
//     res.status(500).json({ message: "Error generating recommendations" });
//   }
// });

router.post("/recommend", async (req, res) => {
  try {
    const { interests, researchField, strengths } = req.body;

    console.log("Received Data:", { interests, researchField, strengths });

    let courses = await Course.find(
      {
        $or: [
          { category: { $regex: interests, $options: "i" } },
          { description: { $regex: researchField, $options: "i" } },
          { tags: { $in: Array.isArray(strengths) ? strengths : [strengths] } },
        ],
      },
      { name: 1, courseType: 1, _id: 1 }
    );

    console.log("Fetched Courses:", courses); // ✅ Check if courses are coming

    // If no exact match, recommend nearest available courses
    if (courses.length === 0) {
      console.log("No exact match. Fetching recommended courses...");
      courses = await Course.find({}, { name: 1, courseType: 1, _id: 1 }).limit(5);
    }

    console.log("Final Courses Sent:", courses);

    const courseList = courses
      .map((course, index) => `${index + 1}. **${course.name}** - ${course.courseType}`)
      .join("\n");

    let aiReply;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: courseList }] }],
      });

      aiReply =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Here are some recommended courses.";
    } catch (aiError) {
      console.error("AI failed, using fallback courses:", aiError);
      aiReply = `We couldn't generate recommendations right now. Here are some suggested courses:\n\n${courseList}`;
    }

    res.json({
      reply: aiReply,
      courses: courses, // ✅ Send the actual course data
    });
  } catch (error) {
    console.error("Error in recommendation:", error);
    res.status(500).json({ message: "Error generating recommendations" });
  }
});

module.exports = router;
