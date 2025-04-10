const express = require("express");
const router = express.Router();
const authMiddleware = require("../Auth/Authentication");

// Import models
const PayLater = require("../Models/payLater");
const Course = require("../Models/course");
// Import person model to ensure it’s registered
const Person = require("../Models/person");

// POST: Book a Pay Later session
router.post("/paylater/book", authMiddleware, async (req, res) => {
  try {
    console.log("hello paylater book");
    const { courseId, tutorId, selectedDate, selectedTime, duration, bonus } = req.body;

    if (!courseId || !tutorId || !selectedDate || !selectedTime || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found in token." });
    }

    const booking = new PayLater({
      courseId,
      tutorId,
      user: userId,  // storing the person's ID
      selectedDate,
      selectedTime,
      duration,
      bonus,
    });

    await booking.save();

    res.status(201).json({ message: "Booking request submitted", data: booking });
  } catch (err) {
    console.error("❌ Error creating Pay Later booking:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Tutor views requests (populating person and course data)
router.get("/paylater/tutor-request", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.user.id;
    console.log("👤 Tutor ID from token:", tutorId);

    const bookings = await PayLater.find({ tutorId })
      .populate("user", "name email")
      .populate("courseId", "name");

    console.log("✅ Bookings for this tutor:", bookings);
    res.status(200).json({ data: bookings });
  } catch (err) {
    console.error("❌ Error fetching tutor bookings:", err);
    res.status(500).json({ error: err.message });
  }
});



// PUT: Tutor updates request status
router.put("/paylater/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'accepted' or 'rejected'." });
    }

    const updated = await PayLater.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("courseId", "name");

    console.log(`✏️ Updating booking ${req.params.id} to status: ${status}`);

    if (!updated) {
      return res.status(404).json({ message: "Booking request not found" });
    }

    res.status(200).json({ message: `Request ${status}`, data: updated });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
