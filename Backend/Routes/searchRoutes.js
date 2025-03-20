const express = require("express");
const router = express.Router();
const Course = require("../Models/course");
const Person = require("../Models/person");
const Tutor = require("../Models/tutors");
const Transaction = require("../Models/transaction");
const GlobalSessionPricing = require("../Models/GlobalSessionPricing");

// Global Search Route
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Define search condition using regex for case-insensitive matching
    const searchCondition = { $regex: query, $options: "i" };

    // Search across multiple collections
    const courses = await Course.find({
      $or: [{ name: searchCondition }, { overview: searchCondition }],
    });

    const persons = await Person.find({
      $or: [{ name: searchCondition }, { email: searchCondition }],
    }).select("-password"); // Exclude passwords for security

    const tutors = await Tutor.find({
      $or: [{ name: searchCondition }, { description: searchCondition }, { subjects: searchCondition }],
    });

    const transactions = await Transaction.find({
      status: searchCondition, // Searching by status (pending, completed, etc.)
    }).populate("user courseId tutorId");

    const sessionPricing = await GlobalSessionPricing.find({
      "sessions.duration": searchCondition,
    });

    res.json({
      courses,
      persons,
      tutors,
      transactions,
      sessionPricing,
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

