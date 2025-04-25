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
const Assignment = require("../Models/assignment");

router.post("/upload-assignment", authMiddleware, async (req, res) => {
  try {
    const { courseName, courseType, description, questions } = req.body;

    const newAssignment = new Assignment({
      tutorId: req.user.id,
      courseName,
      courseType,
      description,
      questions,
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

    const payLaterFilter = date ? { selectedDate: date } : {};
    const transactionFilter = date ? { selectedDate: date } : {};

    const [payLaterData, transactionData] = await Promise.all([
      PayLater.find(payLaterFilter).populate("user courseId").lean(),
      Transaction.find(transactionFilter).populate("user courseId").lean(),
    ]);

    const allEnrollments = [...payLaterData, ...transactionData];

    const grouped = {};

    allEnrollments.forEach((entry) => {
      const dateKey = entry.selectedDate;
      const subject = entry.courseId?.courseType || "Unknown Subject";
      const grade = entry.courseId?.name || "Unknown Grade";
      const student = {
        studentName: entry.user?.name || "No Name",
        email: entry.user?.email || "No Email",
        timeSlot: entry.selectedTime || "Not Provided",
      };

      if (!grouped[dateKey]) grouped[dateKey] = {};
      if (!grouped[dateKey][subject]) grouped[dateKey][subject] = {};
      if (!grouped[dateKey][subject][grade]) grouped[dateKey][subject][grade] = [];

      grouped[dateKey][subject][grade].push(student);
    });

    res.status(200).json({ success: true, grouped });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ success: false, error: "Failed to fetch students" });
  }
});


router.get("/get-assignments", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.user?.id;

    if (!tutorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const assignments = await Assignment.find({ tutorId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch assignments" });
  }
});




module.exports = router;
