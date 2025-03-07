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

router.post("/tutors/:tutorId/availability", async (req, res) => {
  try {
    const { availability } = req.body;

    if (!Array.isArray(availability) || availability.length === 0) {
      return res.status(400).json({ error: "Availability must be a non-empty array" });
    }

    const tutor = await Tutor.findById(req.params.tutorId);
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    console.log("📥 Incoming Availability Data:", availability);

    availability.forEach(({ date, timeSlots }) => {
      const existingDate = tutor.availability.find((entry) => entry.date === date);
      if (existingDate) {
        existingDate.timeSlots = timeSlots; 
      } else {
        tutor.availability.push({ date, timeSlots });
      }
    });

    await tutor.save();


    return res.json({ message: "Availability updated successfully", availability: tutor.availability });

  } catch (error) {
    console.error("❌ Error updating availability:", error);
    return res.status(500).json({ error: "Failed to update availability" });
  }
});
// router.post("/tutors/:tutorId/availability", async (req, res) => {
//   try {
//     const { dates, timeSlots } = req.body;

//     if (!Array.isArray(dates) || !Array.isArray(timeSlots) || dates.length === 0 || timeSlots.length === 0) {
//       return res.status(400).json({ error: "Dates and time slots must be arrays and cannot be empty" });
//     }

//     const tutor = await Tutor.findById(req.params.tutorId);
//     if (!tutor) {
//       console.error("Tutor not found:", req.params.tutorId);
//       return res.status(404).json({ error: "Tutor not found" });
//     }

//     if (!tutor.availability) {
//       tutor.availability = [];
//     }

//     console.log("Before Update:", tutor.availability);

//     // ✅ Ensure each date has its own time slots
//     const newAvailability = dates.map(date => ({
//       date,
//       timeSlots
//     }));

//     // ✅ Check if a date already exists, update time slots instead of duplicating
//     newAvailability.forEach(newDate => {
//       const existingDate = tutor.availability.find(avail => avail.date === newDate.date);
//       if (existingDate) {
//         existingDate.timeSlots = [...new Set([...existingDate.timeSlots, ...newDate.timeSlots])]; // Merge and remove duplicates
//       } else {
//         tutor.availability.push(newDate);
//       }
//     });

//     await tutor.save();

//     console.log("After Update:", tutor.availability);

//     return res.json({ message: "Availability updated successfully", availability: tutor.availability });

//   } catch (error) {
//     console.error("Error updating availability:", error.message);
//     return res.status(500).json({ error: "Failed to update availability", details: error.message });
//   }
// });


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
