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

router.get("/tutors/:tutorId/availability", async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.tutorId);
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }
    res.json(tutor.availability);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});


// router.put("/tutors/:tutorId/availability", async (req, res) => {
//   try {
//     const { availability } = req.body;

//     if (!Array.isArray(availability) || availability.length === 0) {
//       return res.status(400).json({ error: "Availability must be a non-empty array" });
//     }

//     const tutor = await Tutor.findById(req.params.tutorId);
//     if (!tutor) {
//       return res.status(404).json({ error: "Tutor not found" });
//     }

//     // Update existing availability or add new dates
//     availability.forEach(({ date, timeSlots }) => {
//       const existingDate = tutor.availability.find((entry) => entry.date === date);
//       if (existingDate) {
//         existingDate.timeSlots = timeSlots; 
//       } else {
//         tutor.availability.push({ date, timeSlots });
//       }
//     });

//     await tutor.save();
//     return res.json({ message: "Availability updated successfully", availability: tutor.availability });
//   } catch (error) {
//     console.error("Error updating availability:", error);
//     return res.status(500).json({ error: "Failed to update availability" });
//   }
// });


// router.delete("/tutors/:tutorId/availability/:date", async (req, res) => {
//   try {
//     const { tutorId, date } = req.params;

//     const tutor = await Tutor.findById(tutorId);
//     if (!tutor) {
//       return res.status(404).json({ error: "Tutor not found" });
//     }

//     // Remove the specific date
//     tutor.availability = tutor.availability.filter((entry) => entry.date !== date);
//     await tutor.save();

//     res.json({ message: "Availability date removed", availability: tutor.availability });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to remove availability date" });
//   }
// });


// router.delete("/tutors/:tutorId/availability/:date/:timeSlot", async (req, res) => {
//   try {
//     const { tutorId, date, timeSlot } = req.params;

//     const tutor = await Tutor.findById(tutorId);
//     if (!tutor) {
//       return res.status(404).json({ error: "Tutor not found" });
//     }

//     const selectedDate = tutor.availability.find((entry) => entry.date === date);
//     if (!selectedDate) {
//       return res.status(404).json({ error: "Date not found in availability" });
//     }

//     // Remove the specific time slot
//     selectedDate.timeSlots = selectedDate.timeSlots.filter((slot) => slot !== timeSlot);

//     // If no time slots remain for this date, remove the date entry
//     if (selectedDate.timeSlots.length === 0) {
//       tutor.availability = tutor.availability.filter((entry) => entry.date !== date);
//     }

//     await tutor.save();

//     res.json({ message: "Time slot removed", availability: tutor.availability });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to remove time slot" });
//   }
// });

router.get("/tutors/:tutorId", async (req, res) => {
  const tutor = await Tutor.findById(req.params.tutorId);
  if (!tutor) return res.status(404).json({ message: "Tutor not found" });
  res.json(tutor);
});

// router.delete("/tutors/:tutorId/availability/date/:date", async (req, res) => {
//   const { tutorId, date } = req.params;

//   try {
//     const tutor = await Tutor.findById(tutorId);
//     if (!tutor) {
//       return res.status(404).json({ message: "Tutor not found" });
//     }

//     // Filter out the date from availability
//     tutor.availability = tutor.availability.filter(item => item.date !== date);

//     await tutor.save();
//     res.json({ message: "Date deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

router.delete("/tutors/:tutorId/availability/date/:date", async (req, res) => {
  const { tutorId, date } = req.params;

  console.log("Received delete request for date:", date);

  try {
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    // Ensure that the tutor has availability before proceeding
    if (!tutor.availability || tutor.availability.length === 0) {
      return res.status(404).json({ error: "No availability found for this tutor" });
    }

    // Find and remove the date from availability
    const filteredAvailability = tutor.availability.filter(
      (item) => item.date !== date
    );

    // If no change, that means the date didn't exist
    if (filteredAvailability.length === tutor.availability.length) {
      return res.status(404).json({ error: "Date not found in availability" });
    }

    tutor.availability = filteredAvailability;
    await tutor.save();

    return res.json({ message: "Date deleted successfully" });
  } catch (error) {
    console.error("Error deleting date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/tutors/:tutorId/availability/date/:date/time/:time", async (req, res) => {
  const { tutorId, date, time } = req.params;

  console.log("Received delete request for:", date, time);

  try {
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    // Find the availability object for the given date
    const availabilityEntry = tutor.availability.find((entry) => entry.date === date);
    if (!availabilityEntry) {
      return res.status(404).json({ error: "Date not found in availability" });
    }

    // Remove the time slot
    const updatedTimeSlots = availabilityEntry.timeSlots.filter((t) => t !== time);
    if (updatedTimeSlots.length === availabilityEntry.timeSlots.length) {
      return res.status(404).json({ error: "Time slot not found" });
    }

    // If all time slots are removed, delete the entire date entry
    if (updatedTimeSlots.length === 0) {
      tutor.availability = tutor.availability.filter((entry) => entry.date !== date);
    } else {
      availabilityEntry.timeSlots = updatedTimeSlots;
    }

    await tutor.save();
    return res.json({ message: "Time slot deleted successfully" });
  } catch (error) {
    console.error("Error deleting time slot:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
