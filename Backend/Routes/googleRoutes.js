// const express = require("express");
// const mongoose = require("mongoose");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const Course = require("../Models/course");
// const Tutor = require("../Models/tutors");
// const router = express.Router();
// // const { genAI } = require("../config/gemini");
// const session = require("../Auth/Authentication");

// const genAI = new GoogleGenerativeAI("AIzaSyCp3BKQfwA_DFpZlktKIwt3egFcXQI3ylw");

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

// router.post("/recommend", async (req, res) => {
//   try {
//     const { interests, researchField, strengths } = req.body;

//     console.log("Received Data:", { interests, researchField, strengths });

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

//     console.log("Fetched Courses:", courses); // ✅ Check if courses are coming

//     // If no exact match, recommend nearest available courses
//     if (courses.length === 0) {
//       console.log("No exact match. Fetching recommended courses...");
//       courses = await Course.find({}, { name: 1, courseType: 1, _id: 1 }).limit(5);
//     }

//     console.log("Final Courses Sent:", courses);

//     const courseList = courses
//       .map((course, index) => `${index + 1}. **${course.name}** - ${course.courseType}`)
//       .join("\n");

//     let aiReply;
//     try {
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//       const result = await model.generateContent({
//         contents: [{ role: "user", parts: [{ text: courseList }] }],
//       });

//       aiReply =
//         result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//         "Here are some recommended courses.";
//     } catch (aiError) {
//       console.error("AI failed, using fallback courses:", aiError);
//       aiReply = `We couldn't generate recommendations right now. Here are some suggested courses:\n\n${courseList}`;
//     }

//     res.json({
//       reply: aiReply,
//       courses: courses, // ✅ Send the actual course data
//     });
//   } catch (error) {
//     console.error("Error in recommendation:", error);
//     res.status(500).json({ message: "Error generating recommendations" });
//   }
// });

const express = require("express");
const router = express.Router();
const Course = require("../Models/course");
require("dotenv").config();

const { genAI } = require("../config/gemini");

router.post("/chat", async (req, res) => {
  try {
    const { message, conversationData } = req.body;

    // Fetch courses from the database
    const courses = await Course.find();

    // Convert message to lowercase for better matching
    const userQuery = message.toLowerCase();

    // Detect subject dynamically (Can be improved with NLP if needed)
    const subjects = ["math", "chemistry", "physics", "biology"];
    let detectedSubject = subjects.find((subj) => userQuery.includes(subj));

    // If no subject detected, fallback to previously selected subject
    if (!detectedSubject && conversationData.subject) {
      detectedSubject = conversationData.subject.toLowerCase();
    }

    // If still no subject is found, return a general response
    if (!detectedSubject) {
      return res.json({
        aiReply:
          "I couldn't identify the subject. Could you specify whether you need Math, Chemistry, or another subject?",
        courses: [],
      });
    }

    // Store detected subject in conversationData
    conversationData.subject = detectedSubject.charAt(0).toUpperCase() + detectedSubject.slice(1);

    // Filter courses matching the detected subject
    const filteredCourses = courses.filter((course) =>
      course.courseType.toLowerCase().includes(detectedSubject)
    );

    // If no matching courses are found, provide a fallback message
    if (filteredCourses.length === 0) {
      return res.json({
        aiReply: `I couldn't find any ${conversationData.subject} courses at the moment. Would you like to check other subjects?`,
        courses: [],
      });
    }

    // AI Response with relevant courses
    const aiReply = `I found some ${conversationData.subject} courses for you:\n\n${filteredCourses
      .map((c) => `- ${c.name} ($${c.price})`)
      .join("\n")}`;

    res.json({
      aiReply,
      courses: filteredCourses.map((c) => ({ name: c.name, _id: c._id ,courseType: c.courseType})),
      updatedConversation: conversationData,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "AI is unavailable at the moment." });
  }
});


module.exports = router;
