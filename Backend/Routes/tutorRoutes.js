const Tutor = require("../Models/tutors");
const Course = require("../Models/course");
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

// router.post(
//   "/tutors",
//   authMiddleware,
//   upload.single("profilePicture"),
//   async (req, res) => {
//     try {
//       const { name, description } = req.body;
//       const profilePicture = req.file ? `/uploads/${req.file.filename}` : null; // Get uploaded file name

//       if (!profilePicture) {
//         return res.status(400).json({ error: "Profile picture is required" });
//       }

//       const newTutor = new Tutor({
//         name,
//         profilePicture,
//         description,
//       });

//       await newTutor.save();
//       res.status(201).json({ message: "Tutor added successfully", newTutor });
//     } catch (error) {
//       res.status(500).json({ error: "Failed to add tutor" });
//     }
//   }
// );

router.post(
  "/tutors",
  authMiddleware,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      let { name, description, subjects } = req.body;
      const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

      if (!name || !description || !subjects) {
        return res.status(400).json({
          error: "All fields are required (name, description, subjects)",
        });
      }

      // Ensure subjects is an array, already handled by frontend
      if (typeof subjects === "string") {
        try {
          subjects = JSON.parse(subjects); // Convert JSON string to an array
        } catch (error) {
          return res
            .status(400)
            .json({ error: "Invalid subjects format. Must be an array." });
        }
      }

      if (!Array.isArray(subjects) || subjects.length === 0) {
        return res
          .status(400)
          .json({ error: "Subjects must be a non-empty array" });
      }

      if (!profilePicture) {
        return res.status(400).json({ error: "Profile picture is required" });
      }

      const existingTutor = await Tutor.findOne({ name });
      if (existingTutor) {
        return res
          .status(400)
          .json({ error: "Tutor with this name already exists" });
      }

      const newTutor = new Tutor({
        name,
        profilePicture,
        description,
        subjects, // Store subjects correctly
      });

      await newTutor.save();
      res.status(201).json({ message: "Tutor added successfully", newTutor });
    } catch (error) {
      console.error("❌ Error adding tutor:", error);
      res.status(500).json({ error: "Failed to add tutor" });
    }
  }
);

router.use("/uploads", express.static("uploads"));

// router.get("/courses/:courseId/tutors", async (req, res) => {
//   try {
//     const tutors = await Tutor.find();
//     res.json(tutors);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch tutors" });
//   }
// });

router.get("/tutors", async (req, res) => {
  try {
    const tutors = await Tutor.find();
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tutors" });
  }
});

// Get tutors based on course (filtered by subject if applicable)

router.get("/courses/:courseId/tutors", async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    console.log("🔍 Course Type (Subject):", course.courseType); // Debugging

    const tutors = await Tutor.find({ subjects: course.courseType }); // Fix here
    console.log("📢 Tutors Found:", tutors); // Debugging

    res.json(tutors);
  } catch (error) {
    console.error("❌ Error fetching tutors for course:", error);
    res.status(500).json({ error: "Failed to fetch tutors" });
  }
});

// Get all tutors or filter by subject
// router.get("/tutors", async (req, res) => {
//   try {
//     const { subject } = req.query; // Example: /tutors?subject=Biology

//     let filter = {};
//     if (subject) {
//       filter.subjects = subject; // Find tutors that match the subject
//     }

//     const tutors = await Tutor.find(filter);
//     res.json(tutors);
//   } catch (error) {
//     console.error("❌ Error fetching tutors:", error);
//     res.status(500).json({ error: "Failed to fetch tutors" });
//   }
// });

// router.post("/tutors/:tutorId/availability", async (req, res) => {
//   try {
//     const { availability } = req.body;

//     if (!Array.isArray(availability) || availability.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "Availability must be a non-empty array" });
//     }

//     const tutor = await Tutor.findById(req.params.tutorId);
//     if (!tutor) {
//       return res.status(404).json({ error: "Tutor not found" });
//     }

//     console.log("📥 Incoming Availability Data:", availability);

//     availability.forEach(({ date, timeSlots }) => {
//       const existingDate = tutor.availability.find(
//         (entry) => entry.date === date
//       );
//       if (existingDate) {
//         existingDate.timeSlots = timeSlots;
//       } else {
//         tutor.availability.push({ date, timeSlots });
//       }
//     });

//     await tutor.save();

//     return res.json({
//       message: "Availability updated successfully",
//       availability: tutor.availability,
//     });
//   } catch (error) {
//     console.error("❌ Error updating availability:", error);
//     return res.status(500).json({ error: "Failed to update availability" });
//   }
// });

// router.get("/tutors/:tutorId/availability", async (req, res) => {
//   try {
//     const { tutorId } = req.params;
//     const tutor = await Tutor.findById(tutorId);

//     if (!tutor) {
//       return res.status(404).json({ message: "Tutor not found" });
//     }

//     res.json({ availability: tutor.availability || [] });
//     console.log({ availability: tutor.availability || [] });
//   } catch (error) {
//     console.error("Error fetching availability:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

router.get("/tutors/:tutorId/availability", async (req, res) => {
  try {
    const { tutorId } = req.params;
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Convert date to local format and remove empty timeSlots
    const formattedAvailability = tutor.availability
      .map((entry) => ({
        date: entry.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD
        timeSlots: entry.timeSlots.length ? entry.timeSlots : null, // Remove empty timeSlots
      }))
      .filter((entry) => entry.timeSlots !== null); // Exclude empty timeSlots

    res.json({ availability: formattedAvailability });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/tutors/:tutorId/availability", async (req, res) => {
  try {
    const { availability } = req.body;

    if (!Array.isArray(availability) || availability.length === 0) {
      return res
        .status(400)
        .json({ error: "Availability must be a non-empty array" });
    }

    const tutor = await Tutor.findById(req.params.tutorId);
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    console.log("📥 Incoming Availability Data:", availability);

    availability.forEach(({ date, timeSlots }) => {
      const formattedDate = new Date(date).toISOString().split("T")[0]; // Normalize date format
      let existingDate = tutor.availability.find(
        (entry) =>
          new Date(entry.date).toISOString().split("T")[0] === formattedDate
      );

      if (existingDate) {
        timeSlots.forEach((slot) => {
          if (
            !existingDate.timeSlots.some(
              (existingSlot) =>
                existingSlot.startTime === slot.startTime &&
                existingSlot.endTime === slot.endTime
            )
          ) {
            existingDate.timeSlots.push(slot);
          }
        });
      } else {
        tutor.availability.push({
          date: new Date(formattedDate), // Store only date, no time
          timeSlots,
        });
      }
    });

    await tutor.save();

    return res.json({
      message: "Availability updated successfully",
      availability: tutor.availability,
    });
  } catch (error) {
    console.error("❌ Error updating availability:", error);
    return res.status(500).json({ error: "Failed to update availability" });
  }
});

// router.get("/tutors/:tutorId/available-dates", async (req, res) => {
//   try {
//     const { tutorId } = req.params;

//     const tutor = await Tutor.findById(tutorId);
//     if (!tutor) {
//       return res.status(404).json({ error: "Tutor not found" });
//     }

//     const availableDates = tutor.availability.map((entry) => entry.date);
//     res.json(availableDates);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch available dates" });
//   }
// });

router.get("/tutors/:tutorId/available-dates", async (req, res) => {
  try {
    const { tutorId } = req.params;

    let availableDates = new Set(); // Using Set to store unique dates

    if (tutorId === "no-preference") {
      // Fetch all tutors
      const tutors = await Tutor.find();
      tutors.forEach((tutor) => {
        tutor.availability.forEach(({ date }) => {
          availableDates.add(date);
        });
      });
    } else {
      // Fetch specific tutor
      const tutor = await Tutor.findById(tutorId);
      if (!tutor) {
        return res.status(404).json({ error: "Tutor not found" });
      }
      tutor.availability.forEach(({ date }) => {
        availableDates.add(date);
      });
    }

    // Convert set to array and filter for next 2 months
    const today = new Date();
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

    availableDates = [...availableDates].filter((date) => {
      const dateObj = new Date(date);
      return dateObj >= today && dateObj <= twoMonthsLater;
    });

    res.json(availableDates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available dates" });
  }
});

// router.get("/tutors/:tutorId/available-slots", async (req, res) => {
//   try {
//     const { tutorId } = req.params;
//     const { date } = req.query;

//     if (!date) {
//       return res.status(400).json({ error: "Date is required" });
//     }

//     const tutor = await Tutor.findById(tutorId);
//     if (!tutor) {
//       return res.status(404).json({ error: "Tutor not found" });
//     }

//     const selectedDate = tutor.availability.find(
//       (entry) => entry.date === date
//     );
//     if (!selectedDate) {
//       return res
//         .status(404)
//         .json({ error: "No available slots for this date" });
//     }

//     res.json(selectedDate.timeSlots);
//   } catch (error) {
//     console.error("Error fetching tutor-specific slots:", error);
//     res.status(500).json({ error: "Failed to fetch available time slots" });
//   }
// });

router.get("/tutors/:tutorId/available-slots", async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    let availableSlots = new Set(); // Using Set to avoid duplicate slots

    // Ensure the date is in the same format (YYYY-MM-DD)
    const formattedDate = new Date(date).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format

    if (tutorId === "no-preference") {
      // Fetch time slots from all tutors for the given date
      const tutors = await Tutor.find();
      tutors.forEach((tutor) => {
        // Match only the date part (YYYY-MM-DD) by converting the stored date to ISO string and comparing the date part
        const selectedDate = tutor.availability.find((entry) => {
          const entryDate = new Date(entry.date).toISOString().split('T')[0]; // Convert stored date to YYYY-MM-DD
          return entryDate === formattedDate; // Compare the date part only
        });
        if (selectedDate) {
          selectedDate.timeSlots.forEach((slot) => availableSlots.add(slot));
        }
      });
    } else {
      // Fetch specific tutor's time slots
      const tutor = await Tutor.findById(tutorId);
      if (!tutor) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      const selectedDate = tutor.availability.find((entry) => {
        const entryDate = new Date(entry.date).toISOString().split('T')[0]; // Convert stored date to YYYY-MM-DD
        return entryDate === formattedDate; // Compare the date part only
      });

      if (!selectedDate) {
        return res.status(404).json({ error: "No available slots for this date" });
      }

      selectedDate.timeSlots.forEach((slot) => availableSlots.add(slot));
    }

    res.json([...availableSlots]); // Convert Set to Array and return
  } catch (error) {
    console.error("Error fetching tutor-specific slots:", error);
    res.status(500).json({ error: "Failed to fetch available time slots" });
  }
});


// router.get("/tutors/:tutorId/available-slots", async (req, res) => {
//   try {
//     const { tutorId } = req.params;
//     let { date } = req.query;

//     if (!Array.isArray(date)) {
//       date = [date]; // Ensure it's an array
//     }

//     console.log("Fetching available slots for:", date);

//     const tutor = await Tutor.findById(tutorId);
//     if (!tutor) {
//       return res.status(404).json({ message: "Tutor not found" });
//     }

//     // Query to find slots on given dates
//     const availableSlots = tutor.availability.filter((slot) =>
//       date.includes(slot.date)
//     );

//     res.json(availableSlots);
//   } catch (error) {
//     console.error("Error fetching slots:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });






router.get("/tutors/:tutorId", async (req, res) => {
  const tutor = await Tutor.findById(req.params.tutorId);
  if (!tutor) return res.status(404).json({ message: "Tutor not found" });
  res.json(tutor);
});

// router.delete("/tutors/:tutorId/availability/date/:date", async (req, res) => {
//   const { tutorId, date } = req.params;

//   console.log("Received delete request for date:", date);

//   try {
//     const tutor = await Tutor.findById(tutorId);
//     if (!tutor) {
//       return res.status(404).json({ error: "Tutor not found" });
//     }

//     // Ensure that the tutor has availability before proceeding
//     if (!tutor.availability || tutor.availability.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No availability found for this tutor" });
//     }

//     // Find and remove the date from availability
//     const filteredAvailability = tutor.availability.filter(
//       (item) => item.date !== date
//     );

//     // If no change, that means the date didn't exist
//     if (filteredAvailability.length === tutor.availability.length) {
//       return res.status(404).json({ error: "Date not found in availability" });
//     }

//     tutor.availability = filteredAvailability;
//     await tutor.save();

//     return res.json({ message: "Date deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting date:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.delete("/tutors/:tutorId/availability/date/:date", async (req, res) => {
  const { tutorId, date } = req.params;

  console.log("🗑️ Received delete request for date:", date);

  try {
    // Convert date from request to a Date object (ignoring time)
    const formattedDate = new Date(date).toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'

    // Find the tutor by ID
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    // Normalize tutor availability dates
    const filteredAvailability = tutor.availability.filter(
      (entry) =>
        new Date(entry.date).toISOString().split("T")[0] !== formattedDate
    );

    if (filteredAvailability.length === tutor.availability.length) {
      return res.status(404).json({ error: "Date not found in availability" });
    }

    tutor.availability = filteredAvailability;
    await tutor.save();

    return res.json({
      message: "Date deleted successfully",
      updatedAvailability: tutor.availability,
    });
  } catch (error) {
    console.error("❌ Error deleting date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.delete(
//   "/tutors/:tutorId/availability/date/:date/time/:time",
//   async (req, res) => {
//     const { tutorId, date, time } = req.params;

//     console.log("Received delete request for:", date, time);

//     try {
//       const tutor = await Tutor.findById(tutorId);
//       if (!tutor) {
//         return res.status(404).json({ error: "Tutor not found" });
//       }

//       // Find the availability object for the given date
//       const availabilityEntry = tutor.availability.find(
//         (entry) => entry.date === date
//       );
//       if (!availabilityEntry) {
//         return res
//           .status(404)
//           .json({ error: "Date not found in availability" });
//       }

//       // Remove the time slot
//       const updatedTimeSlots = availabilityEntry.timeSlots.filter(
//         (t) => t !== time
//       );
//       if (updatedTimeSlots.length === availabilityEntry.timeSlots.length) {
//         return res.status(404).json({ error: "Time slot not found" });
//       }

//       // If all time slots are removed, delete the entire date entry
//       if (updatedTimeSlots.length === 0) {
//         tutor.availability = tutor.availability.filter(
//           (entry) => entry.date !== date
//         );
//       } else {
//         availabilityEntry.timeSlots = updatedTimeSlots;
//       }

//       await tutor.save();
//       return res.json({ message: "Time slot deleted successfully" });
//     } catch (error) {
//       console.error("Error deleting time slot:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// );

router.delete(
  "/tutors/:tutorId/availability/date/:date/time/:time",
  async (req, res) => {
    const { tutorId, date, time } = req.params;

    console.log("🗑️ Received delete request for:", date, time);

    try {
      // Find the tutor by ID
      const tutor = await Tutor.findById(tutorId);
      if (!tutor) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      // Convert the date in params to a Date object for proper comparison
      const dateObj = new Date(date);

      // Find the date entry
      const availabilityEntry = tutor.availability.find(
        (entry) => new Date(entry.date).toISOString() === dateObj.toISOString()
      );

      if (!availabilityEntry) {
        return res
          .status(404)
          .json({ error: "Date not found in availability" });
      }

      // Ensure time is compared correctly (assumes time is an object with an _id or another unique property)
      const timeSlotId = time; // Adjust this based on how time is structured (use _id or other unique field)

      // Remove the specified time slot
      const updatedTimeSlots = availabilityEntry.timeSlots.filter(
        (t) => t._id.toString() !== timeSlotId // Ensure comparison by _id if time is an object
      );

      if (updatedTimeSlots.length === availabilityEntry.timeSlots.length) {
        return res.status(404).json({ error: "Time slot not found" });
      }

      // If all time slots are removed, delete the entire date entry
      if (updatedTimeSlots.length === 0) {
        tutor.availability = tutor.availability.filter(
          (entry) => entry.date !== dateObj.toISOString() // Match by ISO string for consistency
        );
      } else {
        availabilityEntry.timeSlots = updatedTimeSlots;
      }

      await tutor.save();
      return res.json({
        message: "Time slot deleted successfully",
        updatedAvailability: tutor.availability,
      });
    } catch (error) {
      console.error("❌ Error deleting time slot:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;

// router.get("/tutors/:tutorId/available-slots", async (req, res) => {
//   try {
//     const { tutorId } = req.params;
//     const { date } = req.query;

//     if (!date) {
//       return res.status(400).json({ error: "Date is required" });
//     }

//     const tutor = await Tutor.findById(tutorId);
//     if (!tutor) {
//       return res.status(404).json({ error: "Tutor not found" });
//     }

//     const selectedDate = tutor.availability.find(
//       (entry) => entry.date === date
//     );
//     if (!selectedDate) {
//       return res
//         .status(404)
//         .json({ error: "No available slots for this date" });
//     }

//     res.json(selectedDate.timeSlots);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch available time slots" });
//   }
// });
// const getAvailableTimeSlots = (timeSlots, duration) => {
//   const availableSlots = [];
//   let startTime = null;

//   for (let i = 0; i < timeSlots.length; i++) {
//     if (!startTime) {
//       startTime = timeSlots[i]; // First available time slot
//       availableSlots.push(startTime);
//     } else {
//       const [prevHour, prevMin] = availableSlots[availableSlots.length - 1]
//         .split(/[:\s]/)
//         .map((t, i) => (i < 2 ? parseInt(t) : t));

//       const [currHour, currMin] = timeSlots[i]
//         .split(/[:\s]/)
//         .map((t, i) => (i < 2 ? parseInt(t) : t));

//       // Convert time to 24-hour format for calculation
//       let prevTotalMins = prevHour * 60 + prevMin + duration;
//       let currTotalMins = currHour * 60 + currMin;

//       if (prevTotalMins <= currTotalMins) {
//         availableSlots.push(timeSlots[i]);
//       }
//     }
//   }

//   return availableSlots;
// };

// router.get("/tutors/:tutorId/availability", async (req, res) => {
//   const { date, duration } = req.query; // duration in minutes

//   const tutor = await Tutor.findById(req.params.tutorId);
//   if (!tutor) return res.status(404).json({ message: "Tutor not found" });

//   const selectedDate = tutor.availability.find((a) => a.date === date);
//   if (!selectedDate) return res.json({ timeSlots: [] });

//   const adjustedSlots = getAvailableTimeSlots(
//     selectedDate.timeSlots,
//     parseInt(duration)
//   );
//   res.json({ timeSlots: adjustedSlots });
// });
