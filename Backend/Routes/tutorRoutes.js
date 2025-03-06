const Tutor = require("../Models/tutors");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../Auth/Authentication");

const storage = multer.diskStorage({
  destination: "uploads/", 
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});

const upload = multer({ storage });

router.post(
  "/tutors",
  authMiddleware,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { name, description } = req.body;
      const profilePicture = req.file ? `/uploads/${req.file.filename}` : null; // Get uploaded file name

      if (!profilePicture) {
        return res.status(400).json({ error: "Profile picture is required" });
      }

      const newTutor = new Tutor({
        name,
        profilePicture,
        description,
      });

      await newTutor.save();
      res.status(201).json({ message: "Tutor added successfully", newTutor });
    } catch (error) {
      res.status(500).json({ error: "Failed to add tutor" });
    }
  }
);


router.use("/uploads", express.static("uploads"));

router.get("/courses/:courseId/tutors", async (req, res) => {
  try {
    const tutors = await Tutor.find(); 
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tutors" });
  }
});

router.get("/tutors", async (req, res) => {
  try {
    const tutors = await Tutor.find(); 
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tutors" });
  }
});

router.post(
  "/tutors/:tutorId/availability",
  authMiddleware,
  async (req, res) => {
    try {
      const { tutorId } = req.params;
      const { date, timeSlots } = req.body;

      if (!date || !timeSlots || !Array.isArray(timeSlots)) {
        return res
          .status(400)
          .json({ error: "Date and valid time slots are required" });
      }

    //   const tutor = await Tutor.findById(tutorId);
    //   if (!tutor) {
    //     return res.status(404).json({ error: "Tutor not found" });
    //   }
    
        const tutor = await Tutor.findById(tutorId);
        if (!tutor) {
          return res.status(404).json({ error: "Tutor not found" });
        }
    
        res.json(tutor.availability);

      const existingDate = tutor.availability.find((d) => d.date === date);
      if (existingDate) {
        existingDate.timeSlots = timeSlots; 
      } else {
        tutor.availability.push({ date, timeSlots });
      }

      await tutor.save();
      res
        .status(200)
        .json({ message: "Availability updated successfully", tutor });
    } catch (error) {
      res.status(500).json({ error: "Failed to update availability" });
    }
  }
);
router.get("/tutors/:tutorId/availability", async (req, res) => {
  
});


router.get("/tutors/:tutorId/available-dates", async (req, res) => {
  try {
    const { tutorId } = req.params;

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    const availableDates = tutor.availability.map((entry) => entry.date);
    res.json(availableDates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available dates" });
  }
});


router.get("/tutors/:tutorId/available-slots", async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    const selectedDate = tutor.availability.find(
      (entry) => entry.date === date
    );
    if (!selectedDate) {
      return res
        .status(404)
        .json({ error: "No available slots for this date" });
    }

    res.json(selectedDate.timeSlots);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available time slots" });
  }
});
module.exports = router;
