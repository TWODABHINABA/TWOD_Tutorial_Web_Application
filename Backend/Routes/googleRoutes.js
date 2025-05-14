const express = require("express");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Course = require("../Models/course");
const Tutor = require("../Models/tutors");
const router = express.Router();
const Assignment = require("../Models/assignment");
const PayLater = require("../Models/payLater");
const Transaction = require("../Models/transaction");
const GlobalSessionPricing = require("../Models/GlobalSessionPricing");
// const { genAI } = require("../config/gemini");
const session = require("../Auth/Authentication");
const { askGemini } = require("../services/ai");

const Person = require("../Models/person");

const genAI = new GoogleGenerativeAI("AIzaSyC4DDFrnigy4pm9GLlvfPh2x0BYY_LOljU");

// router.post('/chatbot', async (req, res) => {
//   const { question } = req.body;

//   try {
//     // Fetch ALL data relevant for answering
//     // const courses = await Course.find({}).lean();
//     const courses = await Course.find({}, 'name courseType instructor price description').lean();
//     const tutors = await Tutor.find({}).lean();
//     const persons = await Person.find({}).lean();
//     const pricing = await GlobalSessionPricing.findOne({}).lean();

//     const context = `
// Here is the data from our platform. Answer the user’s query using ONLY this information.

// --- COURSES ---
// ${courses.map(c => `Name: ${c.name}, Type: ${c.courseType}, Instructor: ${c.instructor}, Price: ${c.price}, Description: ${c.description}`).join('\n')}

// --- TUTORS ---
// ${tutors.map(t => `Name: ${t.name}, Email: ${t.email}, Subjects: ${t.subjects?.join(', ')}`).join('\n')}

// --- USERS ---
// ${persons.map(p => `Name: ${p.name}, Email: ${p.email}, Purchased Courses: ${p.purchasedCourses?.length || 0}`).join('\n')}

// --- SESSION PRICING ---
// ${pricing?.sessions?.map(s => `Duration: ${s.duration}, Price: ${s.price}, Features: ${s.features.join(', ')}`).join('\n')}

// User asked: "${question}"
// `;

//     const aiResponse = await askGemini(context);
//     res.json({ answer: aiResponse });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Chatbot error' });
//   }
// });






let conversationMemory = {
  lastMentionedCourse: null,
  lastCourseType: null
};

router.post("/chatbot", async (req, res) => {
  const { userMessage } = req.body;

  try {
    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ message: "Invalid user message." });
    }

    const cleanedInput = userMessage.trim().toLowerCase();

    const subjects = [
      "math", "science", "english", "biology", "chemistry", "physics",
      "history", "geography", "coding", "programming", "python", "javascript"
    ];

    const matchedSubject = subjects.find(subject =>
      cleanedInput.includes(subject)
    );

    // Search courses
    const courseQuery = matchedSubject
      ? {
          $or: [
            { name: { $regex: matchedSubject, $options: "i" } },
            { courseType: { $regex: matchedSubject, $options: "i" } },
            { description: { $regex: matchedSubject, $options: "i" } },
            { "curriculum.lessons.title": { $regex: matchedSubject, $options: "i" } }
          ]
        }
      : {
          $or: [
            { name: { $regex: userMessage, $options: "i" } },
            { courseType: { $regex: userMessage, $options: "i" } },
            { description: { $regex: userMessage, $options: "i" } },
            { "curriculum.lessons.title": { $regex: userMessage, $options: "i" } }
          ]
        };

    const courseResults = await Course.find(courseQuery);

    // Update memory
    if (courseResults.length === 1) {
      conversationMemory.lastMentionedCourse = courseResults[0].name;
      conversationMemory.lastCourseType = courseResults[0].courseType;
    }

    const rememberedCourseName = conversationMemory.lastMentionedCourse;

    const assignmentResults = await Assignment.find({
      $or: [
        { courseName: { $regex: userMessage, $options: "i" } },
        { courseType: { $regex: userMessage, $options: "i" } },
        { "questions.text": { $regex: userMessage, $options: "i" } }
      ]
    });

    const payLaterResults = await PayLater.find({
      $or: [
        { selectedDate: { $regex: userMessage, $options: "i" } },
        { selectedTime: { $regex: userMessage, $options: "i" } }
      ]
    }).populate("courseId");

    const transactionResults = await Transaction.find({
      $or: [
        { selectedDate: { $regex: userMessage, $options: "i" } },
        { selectedTime: { $regex: userMessage, $options: "i" } }
      ]
    }).populate("courseId");

    // Check if user asked for price or duration
    const asksForPricing = /price|cost|fees?|how much/.test(cleanedInput);
    const asksForDuration = /duration|time|how long/.test(cleanedInput);

    let sessionPricingResults = [];

    if (asksForPricing || asksForDuration) {
      sessionPricingResults = await GlobalSessionPricing.find({});
    }

    // Compose response context
    const contextParts = [];

    if (courseResults.length) {
      contextParts.push("**Matched Courses:**");
      for (const course of courseResults) {
        contextParts.push(`- ${course.name} (${course.courseType}): ${course.description}`);
      }
    }

    if (sessionPricingResults.length) {
      contextParts.push(`\n**Session Pricing & Duration (Dynamic):**`);
      const sessions = sessionPricingResults[0]?.sessions || [];
      sessions.forEach(session => {
        contextParts.push(`- ${session.duration} — ₹${session.price} — Features: ${session.features.join(", ")}`);
      });
    }

    if (assignmentResults.length) {
      contextParts.push("\n**Matched Assignments:**");
      assignmentResults.forEach(a => {
        contextParts.push(`- ${a.courseName} (${a.courseType}) — ${a.description}`);
      });
    }

    if (payLaterResults.length) {
      contextParts.push("\n**Matched PayLater Enrollments:**");
      payLaterResults.forEach(p => {
        contextParts.push(`- ${p.courseId?.name || "Course"} on ${p.selectedDate} at ${p.selectedTime}`);
      });
    }

    if (transactionResults.length) {
      contextParts.push("\n**Matched Transactions:**");
      transactionResults.forEach(t => {
        contextParts.push(`- ${t.courseId?.name || "Course"} on ${t.selectedDate} at ${t.selectedTime}`);
      });
    }

    const finalContext = contextParts.join("\n");

    let aiReply;
    if (!finalContext.trim()) {
      // Fallback if no context found but user asked for pricing/duration
      if (asksForPricing || asksForDuration) {
        const fallbackPricing = sessionPricingResults[0]?.sessions || [];
        if (fallbackPricing.length) {
          aiReply = `We offer dynamic pricing based on session duration. Here's the pricing:\n` +
            fallbackPricing.map(s => `- ${s.duration}: ₹${s.price} (Includes: ${s.features.join(", ")})`).join("\n");
        } else {
          aiReply = "We offer dynamic pricing and session durations, but no details are available at the moment.";
        }
      } else {
        aiReply = "Sorry, I couldn't find any information related to your question in our system.";
      }
    } else {
      const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You're an educational assistant. Use only the internal data provided below to answer the user's question clearly:\n\n${finalContext}\n\nUser Question: ${userMessage}`
              }
            ]
          }
        ]
      });

      aiReply =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Here’s what I found based on our records.";
    }

    return res.json({ reply: aiReply });

  } catch (error) {
    console.error("AI Chatbot error:", error.message || error);
    return res.status(500).json({ message: "Chatbot failed to generate a response." });
  }
});

module.exports = router;
