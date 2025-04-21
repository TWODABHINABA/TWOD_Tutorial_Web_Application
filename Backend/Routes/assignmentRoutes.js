const Tutor = require("../Models/tutors");
const Course = require("../Models/course");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const PayLater = require("../Models/payLater");
const Transaction = require("../Models/transaction");
const Person = require("../Models/person");
const authMiddleware = require("../Auth/Authentication");
const sendEmail = require("../emailService");
const Notification = require("../Models/transaction");

router.post("/upload-assignment", authMiddleware, async (req, res) => {
  try {
    const { courseName, courseType, date, fileUrl, description } = req.body;

    const newAssignment = new AssignmentUpload({
      tutorId: req.user.id,
      courseName,
      courseType,
      date,
      fileUrl,
      description,
    });

    await newAssignment.save();
    res.status(200).json({ success: true, assignment: newAssignment });
  } catch (error) {
    console.error("Error uploading assignment:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to upload assignment" });
  }
});

router.get("/assignments/students", authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;

    const [payLaterData, transactionData] = await Promise.all([
      PayLater.find({ date }).lean(),
      Transaction.find({ date }).lean(),
    ]);

    // Combine and group them
    const allEnrollments = [...payLaterData, ...transactionData];

    const groupedBySubject = {};

    allEnrollments.forEach((entry) => {
      const key = `${entry.name}-${entry.courseType}`; // Chemistry-Grade 10

      if (!groupedBySubject[key]) {
        groupedBySubject[key] = [];
      }

      groupedBySubject[key].push({
        studentName: entry.studentName,
        email: entry.email,
        timeSlot: entry.timeSlot,
      });
    });

    res.status(200).json({ success: true, grouped: groupedBySubject });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ success: false, error: "Failed to fetch students" });
  }
});

module.exports = router;
