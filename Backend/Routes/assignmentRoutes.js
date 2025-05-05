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
const Notification = require("../Models/transaction");
const Assignment = require("../Models/assignment");
const sendEmail = require("../emailService");
const moment = require("moment");

router.post("/upload-assignment", authMiddleware, async (req, res) => {
  try {
    const { courseName, courseType, description, questions } = req.body;

    const existing = await Assignment.findOne({
      tutorId: req.user.id,
      courseName: { $regex: new RegExp(`^${courseName}$`, "i") },
      courseType: { $regex: new RegExp(`^${courseType}$`, "i") },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Assignment for this subject and grade already exists.",
      });
    }

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

router.get("/get-assignment", async (req, res) => {
  const { courseName, courseType } = req.query;

  try {
    const assignment = await Assignment.findOne({ courseName, courseType });
    if (!assignment) {
      return res.status(404).json({ message: "No assignment found" });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/update-assignment/:id", authMiddleware, async (req, res) => {
  try {
    const { description, questions } = req.body;
    const { id } = req.params;

    console.log("IDDDDDDDDDDDDDDD", id);

    const assignment = await Assignment.findOne({
      _id: id,
      tutorId: req.user.id,
    });

    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found." });
    }

    if (description !== undefined) assignment.description = description;
    if (questions !== undefined) assignment.questions = questions;

    await assignment.save();
    res.status(200).json({ success: true, assignment });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to update assignment" });
  }
});

router.get("/grades-by-subject/:subject", async (req, res) => {
  try {
    const { subject } = req.params;

    const grades = await Course.distinct("name", { courseType: subject });

    res.status(200).json({ success: true, grades });
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ success: false, error: "Failed to fetch grades" });
  }
});

router.get("/assignments/students", authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;

    const allowedStatuses = ["accepted", "pending", "completed"];

    const payLaterFilter = {
      ...(date && { selectedDate: date }),
      status: { $in: allowedStatuses }, // ✅ filter by status
    };

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
      if (!grouped[dateKey][subject][grade])
        grouped[dateKey][subject][grade] = [];

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

    const assignments = await Assignment.find({ tutorId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch assignments" });
  }
});

router.get("/assignments/already-sent", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.user.id;

    const persons = await Person.find({
      "receivedAssignments.0": { $exists: true },
    })
      .populate("receivedAssignments.assignment")
      .populate("receivedAssignments.course")
      .lean();

    const grouped = {};

    for (const person of persons) {
      const assignments = person.receivedAssignments || [];

      for (const item of assignments) {
        const { date, subject, grade, assignment, deadline } = item;

        if (!assignment || assignment.tutorId.toString() !== tutorId.toString())
          continue;

        const dateKey = date;
        const subjectKey = subject || "Unknown Subject";
        const gradeKey = grade || "Unknown Grade";

        const studentData = {
          studentName: person.name || "No Name",
          email: person.email || "No Email",
          timeSlot: "Not Available", // You can adjust this if needed
          assignmentId: assignment._id,
          assignmentTitle: assignment.courseName,
          description: assignment.description,
        };

        if (!grouped[dateKey]) grouped[dateKey] = {};
        if (!grouped[dateKey][subjectKey]) grouped[dateKey][subjectKey] = {};
        if (!grouped[dateKey][subjectKey][gradeKey])
          grouped[dateKey][subjectKey][gradeKey] = {
            students: [],
            assignment: {
              id: assignment._id,
              title: assignment.courseName,
              description: assignment.description,
              deadline: deadline || null,
            },
          };

        grouped[dateKey][subjectKey][gradeKey].students.push(studentData);
      }
    }

    res.status(200).json({ success: true, grouped });
  } catch (error) {
    console.error("❌ Error fetching already sent assignments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/get-assignment/:id", authMiddleware, async (req, res) => {
  try {
    const { id: assignmentId } = req.params;
    const userId = req.user.id;

    // Check if user has received this assignment
    const user = await Person.findById(userId);

    const hasAccess = user?.receivedAssignments?.some(
      (item) => item.assignment.toString() === assignmentId
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this assignment",
      });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    res.status(200).json({ success: true, assignment });
  } catch (error) {
    console.error("❌ Error fetching assignment securely:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post(
  "/send-assignment-to-students",
  authMiddleware,
  async (req, res) => {
    try {
      const { assignmentId, date, subject, grade } = req.body;

      if (!assignmentId || !date || !subject || !grade) {
        return res
          .status(400)
          .json({ success: false, message: "Missing fields" });
      }

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        return res
          .status(404)
          .json({ success: false, message: "Assignment not found" });
      }

      const allowedStatuses = ["accepted", "pending", "completed"];

      // Find relevant PayLater and Transaction students
      const payLaterFilter = {
        selectedDate: date,
        status: { $in: allowedStatuses },
      };

      const transactionFilter = { selectedDate: date };

      const [payLaterData, transactionData] = await Promise.all([
        PayLater.find(payLaterFilter).populate("courseId").populate("user"),
        Transaction.find(transactionFilter)
          .populate("courseId")
          .populate("user"),
      ]);

      // Filter by subject and grade
      const matchingPayLater = payLaterData.filter(
        (entry) =>
          entry.courseId?.courseType === subject &&
          entry.courseId?.name === grade
      );

      const matchingTransactions = transactionData.filter(
        (entry) =>
          entry.courseId?.courseType === subject &&
          entry.courseId?.name === grade
      );

      // Track how many students received
      let updatedCount = 0;

      const allMatchedUsers = [
        ...matchingPayLater.map((entry) => ({
          user: entry.user,
          course: entry.courseId,
        })),
        ...matchingTransactions.map((entry) => ({
          user: entry.user,
          course: entry.courseId,
        })),
      ];

      for (const { user, course } of allMatchedUsers) {
        if (!user || !user._id) continue;

        // Avoid duplicate assignment
        const alreadyReceived = user.receivedAssignments?.some(
          (item) =>
            item.assignment.toString() === assignmentId &&
            item.date === date &&
            item.subject === subject &&
            item.grade === grade
        );

        if (!alreadyReceived) {
          await Person.findByIdAndUpdate(user._id, {
            $push: {
              receivedAssignments: {
                assignment: assignment._id,
                course: course._id,
                date,
                subject,
                grade,
                receivedAt: new Date(),
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              },
            },
          });

          // const assignmentViewLink = `http://localhost:5173/assignment-view/${assignment._id}`;
          const assignmentViewLink = `https://twod-tutorial-web-application-phi.vercel.app/assignment-view/${assignment._id}`;

          const deadlineDate = moment()
            .add(3, "days")
            .format("MMMM Do YYYY, h:mm A"); // e.g., May 3rd 2025, 4:00 PM

          await sendEmail(
            user.email,
            `New Assignment: ${assignment.courseName}`,
            `You have a new assignment in ${assignment.courseName} - ${assignment.courseType}`,
            `
              <p>Hello ${user.name || "Student"},</p>
              <p>You have received a new assignment for <strong>${assignment.courseName}</strong> - <strong>${assignment.courseType}</strong>.</p>
              <p><strong>Description:</strong> ${assignment.description || "No description provided"}</p>
              <p>You can <a href="${assignmentViewLink}" target="_blank">view and download the assignment here</a>.</p>
              <p><strong>Note:</strong> This assignment must be completed before <strong>${deadlineDate}</strong>. After that, it will be automatically removed.</p>
              <p>Best regards,<br/>Your Learning Team</p>
            `
          );
          updatedCount++;
        }
      }

      res.status(200).json({
        success: true,
        message: "Assignments delivered and stored successfully.",
        updated: updatedCount,
      });
    } catch (err) {
      console.error("❌ Error sending assignment:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

module.exports = router;
