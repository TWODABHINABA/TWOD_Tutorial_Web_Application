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

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/tutors", authMiddleware, async (req, res) => {
  try {
    let { name, email } = req.body; // Admin provides name & email

    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    email = email.trim().toLowerCase();

    const existingTutor = await Tutor.findOne({ email });
    if (existingTutor) {
      return res
        .status(400)
        .json({ error: "Tutor with this email already exists" });
    }

    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8);

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newTutor = new Tutor({
      email, // Email is the username
      password: hashedPassword,
      name,
      profilePicture: null,
      description: null,
      subjects: [],
    });

    await newTutor.save();

    const emailText = `
Hi ${name},

Welcome to **TWOD Tutorials**! We're excited to have you on board as a tutor.

Below are your login credentials:
- **Email (Username):** ${email}
- **Password:** ${tempPassword}

To get started, please follow these steps:

1. Click on the following link to access the tutor portal:  
   https://twod-tutorial-web-application-phi.vercel.app/

2. On the homepage, navigate to the **Login** section.

3. Log in using the credentials provided above.

4. Reset your password

If you have any questions or need assistance, feel free to reach out to us at **support@twodtutorials.com**.

We're thrilled to have you with us!

Best regards,  
**Team TWOD Tutorials**
`;


    await sendEmail(
      email,
      "Welcome to TWOD Tutorials!",
      emailText
    );

    res.status(201).json({
      message: "Tutor added successfully. Credentials sent via email.",
    });
  } catch (error) {
    console.error("❌ Error adding tutor:", error);
    res.status(500).json({ error: "Failed to add tutor" });
  }
});

router.use("/uploads", express.static("uploads"));

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


router.get("/tutors/me", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.user.id; // ✅ Extract tutor ID from auth middleware

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.json({ subjects: tutor.subjects || [] }); // ✅ Send only subjects
  } catch (error) {
    console.error("Error fetching tutor subjects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/tutors/availability", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.user.id; // Get logged-in tutor's ID
    const { subject } = req.query; // Optional subject filter

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Filter availability by subject (if provided)
    const filteredAvailability = tutor.availability
      .map((entry) => ({
        date: entry.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD
        subjects: entry.subjects.filter(
          (sub) => !subject || sub.subjectName === subject
        ), // Filter by subject
      }))
      .filter((entry) => entry.subjects.length > 0); // Remove entries with no matching subjects

    res.json({ availability: filteredAvailability });
  } catch (error) {
    console.error("❌ Error fetching availability:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/tutors/availability", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.user.id; // Get logged-in tutor's ID
    const { availability } = req.body;

    if (!Array.isArray(availability) || availability.length === 0) {
      return res
        .status(400)
        .json({ error: "Availability must be a non-empty array" });
    }

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    console.log("📥 Incoming Availability Data:", availability);

    for (const { date, subject, timeSlots } of availability) {
      const formattedDate = new Date(date).toISOString().split("T")[0];

      // Check if the tutor already has availability for the selected date
      let existingDate = tutor.availability.find(
        (entry) =>
          new Date(entry.date).toISOString().split("T")[0] === formattedDate
      );

      if (!existingDate) {
        // If date doesn't exist, add new date with the subject
        tutor.availability.push({
          date: new Date(formattedDate),
          subjects: [{ subjectName: subject, timeSlots }],
        });
      } else {
        // Check if the tutor already has a time slot for another subject on the same date
        for (const existingSubject of existingDate.subjects) {
          for (const slot of timeSlots) {
            const conflict = existingSubject.timeSlots.some(
              (existingSlot) =>
                existingSlot.startTime === slot.startTime &&
                existingSlot.endTime === slot.endTime
            );
            if (conflict) {
              return res.status(400).json({
                error: `Conflict detected! You have already added ${existingSlot.startTime} - ${existingSlot.endTime} for ${existingSubject.subjectName}.`,
              });
            }
          }
        }

        // Add the new subject and time slots if no conflict exists
        let subjectEntry = existingDate.subjects.find(
          (sub) => sub.subjectName === subject
        );

        if (!subjectEntry) {
          existingDate.subjects.push({ subjectName: subject, timeSlots });
        } else {
          subjectEntry.timeSlots.push(...timeSlots);
        }
      }
    }

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

router.get("/tutors/:tutorId/available-dates", async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { subject } = req.query; // Get subject from query parameters

    let availableDates = new Set(); // Using Set to store unique dates

    if (tutorId === "no-preference") {
      if (!subject) {
        return res.status(400).json({ error: "Subject is required for no preference" });
      }

      // Fetch tutors who teach the selected subject
      const tutors = await Tutor.find({ "subjects": subject });

      tutors.forEach((tutor) => {
        tutor.availability.forEach(({ date, subjects }) => {
          if (subjects.some(s => s.subjectName === subject)) {
            availableDates.add(date);
          }
        });
      });
    } else {
      // Fetch specific tutor
      const tutor = await Tutor.findById(tutorId);
      if (!tutor) {
        return res.status(404).json({ error: "Tutor not found" });
      }
      tutor.availability.forEach(({ date, subjects }) => {
        if (!subject || subjects.some(s => s.subjectName === subject)) {
          availableDates.add(date);
        }
      });
    }

    // Convert set to array and filter for the next 2 months
    const today = new Date();
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

    availableDates = [...availableDates].filter((date) => {
      const dateObj = new Date(date);
      return dateObj >= today && dateObj <= twoMonthsLater;
    });

    res.json(availableDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch available dates" });
  }
});


router.get("/tutors/:tutorId/available-slots", async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { date, subject } = req.query; // Ensure subject is passed

    if (!date || !subject) {
      return res.status(400).json({ error: "Date and Subject are required" });
    }

    let availableSlots = []; // Array to store available slots

    // Ensure the date is in the correct format
    const formattedDate = new Date(date).toISOString().split('T')[0];

    if (tutorId === "no-preference") {
      // Fetch tutors who teach the selected subject
      const tutors = await Tutor.find({ "subjects": subject });

      tutors.forEach((tutor) => {
        const selectedDate = tutor.availability.find((entry) => {
          const entryDate = new Date(entry.date).toISOString().split('T')[0]; 
          return entryDate === formattedDate;
        });

        if (selectedDate) {
          selectedDate.subjects.forEach((s) => {
            if (s.subjectName === subject) {
              availableSlots.push(...s.timeSlots);
            }
          });
        }
      });
    } else {
      // Fetch specific tutor
      const tutor = await Tutor.findById(tutorId);
      if (!tutor) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      const selectedDate = tutor.availability.find((entry) => {
        const entryDate = new Date(entry.date).toISOString().split('T')[0]; 
        return entryDate === formattedDate;
      });

      if (!selectedDate) {
        return res.status(404).json({ error: "No available slots for this date" });
      }

      selectedDate.subjects.forEach((s) => {
        if (s.subjectName === subject) {
          availableSlots.push(...s.timeSlots);
        }
      });
    }

    res.json(availableSlots);
  } catch (error) {
    console.error("Error fetching tutor-specific slots:", error);
    res.status(500).json({ error: "Failed to fetch available time slots" });
  }
});



router.delete(
  "/tutors/availability/date/:date",
  authMiddleware,
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized access" });
      }

      const { subject } = req.query; // Extract subject from query
      const { date } = req.params; // Extract date from params
      const userId = req.user.id;
      const userRole = req.user.role; // Ensure userRole is defined

      let tutor;

      if (userRole === "admin" && req.query.tutorId) {
        tutor = await Tutor.findById(req.query.tutorId);
      } else {
        tutor = await Tutor.findById(userId);
      }

      if (!tutor) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      console.log("📅 Deleting Availability for Date:", date);

      // Convert `date` to match MongoDB format
      const dateEntry = tutor.availability.find(
        (entry) => entry.date.toISOString().split("T")[0] === date
      );

      if (!dateEntry) {
        return res
          .status(404)
          .json({ error: "Date not found in availability" });
      }

      if (subject) {
        // Remove only the subject's availability instead of the entire date
        dateEntry.subjects = dateEntry.subjects.filter(
          (sub) => sub.subjectName !== subject
        );

        // If no subjects remain for the date, remove the date entry
        if (dateEntry.subjects.length === 0) {
          tutor.availability = tutor.availability.filter(
            (entry) => entry.date.toISOString().split("T")[0] !== date
          );
        }
      } else {
        // If no subject is specified, remove the entire date
        tutor.availability = tutor.availability.filter(
          (entry) => entry.date.toISOString().split("T")[0] !== date
        );
      }

      await tutor.save();

      return res.json({
        message: "Date availability deleted successfully",
        updatedAvailability: tutor.availability,
      });
    } catch (error) {
      console.error("❌ Error deleting date:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete(
  "/tutors/availability/date/:date/time/:time",
  authMiddleware,
  async (req, res) => {
    try {
      const { date, time } = req.params; // Extract from URL params
      const { subject, tutorId } = req.query; // Extract from query params
      const userId = req.user.id;
      const userRole = req.user.role;

      const formattedDate = new Date(date).toISOString().split("T")[0];

      let tutor;
      if (userRole === "admin" && tutorId) {
        tutor = await Tutor.findById(tutorId);
      } else {
        tutor = await Tutor.findById(userId);
      }

      if (!tutor) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      // Find the date entry
      const dateEntry = tutor.availability.find(
        (entry) =>
          new Date(entry.date).toISOString().split("T")[0] === formattedDate
      );

      if (!dateEntry) {
        return res
          .status(404)
          .json({ error: "Date not found in availability" });
      }

      // Find the subject entry
      const subjectEntry = dateEntry.subjects.find(
        (sub) => sub.subjectName === subject
      );
      if (!subjectEntry) {
        return res
          .status(404)
          .json({ error: "Subject not found in availability" });
      }

      // Remove the specified time slot based on `startTime`
      const updatedTimeSlots = subjectEntry.timeSlots.filter(
        (slot) => slot.startTime !== time
      );

      if (updatedTimeSlots.length === subjectEntry.timeSlots.length) {
        return res.status(404).json({ error: "Time slot not found" });
      }

      // Update the subject's time slots
      subjectEntry.timeSlots = updatedTimeSlots;

      // If no time slots remain, remove the subject entry
      if (subjectEntry.timeSlots.length === 0) {
        dateEntry.subjects = dateEntry.subjects.filter(
          (sub) => sub.subjectName !== subject
        );
      }

      // If no subjects remain, remove the entire date entry
      if (dateEntry.subjects.length === 0) {
        tutor.availability = tutor.availability.filter(
          (entry) =>
            new Date(entry.date).toISOString().split("T")[0] !== formattedDate
        );
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


router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.user.id;
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) return res.status(404).json({ message: "Tutor not found" });

    const subjectCounts = {};
    const uniqueStudentIds = new Set(); // 👈 new line

    // --- Get enrollments from PayLater ---
    const payLaterEnrollments = await PayLater.find({
      tutorId,
      status: { $in: ["accepted", "completed", "pending for tutor acceptance"] },
    }).populate("courseId user"); // 👈 also populate user

    payLaterEnrollments.forEach((enroll) => {
      const subject = enroll.courseId?.subject;
      const studentId = enroll.user?._id;
      if (subject) {
        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
      }
      if (studentId) {
        uniqueStudentIds.add(studentId.toString());
      }
    });

    // --- Get enrollments from Transaction ---
    const transactionEnrollments = await Transaction.find({
      tutorId,
      status: "completed",
    }).populate("courseId user"); // 👈 also populate user

    transactionEnrollments.forEach((enroll) => {
      const subject = enroll.courseId?.subject;
      const studentId = enroll.user?._id;
      if (subject) {
        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
      }
      if (studentId) {
        uniqueStudentIds.add(studentId.toString());
      }
    });

    const today = new Date().toISOString().split("T")[0];

    const upcomingPayLater = await PayLater.find({
      tutorId,
      selectedDate: { $gte: today },
      status: { $in: ["accepted", "completed", "pending for tutor acceptance"] },
    }).populate("user courseId");

    const upcomingTransactions = await Transaction.find({
      tutorId,
      selectedDate: { $gte: today },
      status: "completed",
    }).populate("user courseId");
    upcomingClasses = [];
    upcomingPayLater.forEach((item) => {
      if (item.courseId && item.user) {
        upcomingClasses.push({
          status: item.status,
          subject: item.courseId.courseType,
          grade: item.courseId.name,
          date: item.selectedDate,
          time: item.selectedTime,
          studentName: item.user.name,
        });
      }
    });

    upcomingTransactions.forEach((item) => {
      if (item.courseId && item.user) {
        upcomingClasses.push({
          status: item.status,
          subject: item.courseId.courseType,
          grade: item.courseId.name,
          date: item.selectedDate,
          time: item.selectedTime,
          studentName: item.user.name,
        });
      }
    });



    const previousPayLaters = await PayLater.find({
      tutorId,
      selectedDate: { $lt: today },
      status: { $in: ["accepted", "completed", "pending for tutor acceptance"] },
    }).populate("user courseId");

    const previousTransactions = await Transaction.find({
      tutorId,
      selectedDate: { $lt: today },
      status: "completed",
    }).populate("user courseId");

    const previousClasses = [];
    previousPayLaters.forEach((item) => {
      if (item.courseId && item.user) {
        previousClasses.push({
          status: item.status,
          subject: item.courseId.courseType,
          grade: item.courseId.name,
          date: item.selectedDate,
          time: item.selectedTime,
          studentName: item.user.name,
        });
      }
    });

    previousTransactions.forEach((item) => {
      if (item.courseId && item.user) {
        previousClasses.push({
          status: item.status,
          subject: item.courseId.courseType,
          grade: item.courseId.name,
          date: item.selectedDate,
          time: item.selectedTime,
          studentName: item.user.name,
        });
      }
    });
    

    res.status(200).json({
      totalStudents: uniqueStudentIds.size, // 👈 return total students
      enrolledSubjects: subjectCounts,
      upcomingClasses,
      previousClasses,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// router.get("/students", authMiddleware, async (req, res) => {
//   try {
//     const tutorId = req.user.id;

//     const payLater = await PayLater.find({
//       tutorId,
//       status: { $in: ["accepted", "completed"] },
//     }).populate("user")

//     const transactions = await Transaction.find({
//       tutorId,
//       status: "completed",
//     }).populate("user")

//     const studentMap = new Map();

//     [...payLater, ...transactions].forEach((enroll) => {
//       if (enroll.user) {
//         studentMap.set(enroll.user._id.toString(), enroll.user);
//       }
//     });

//     const students = Array.from(studentMap.values());

//     res.status(200).json({ students });
//   } catch (err) {
//     console.error("Error fetching student list:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


router.get("/students", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.user.id;

    // Fetch all relevant transactions
    const payLater = await PayLater.find({
      tutorId,
      status: { $in: ["accepted", "completed", "pending for tutor acceptance"] },
    })
    .populate({
      path: "user",
      select: "-password" // exclude password
    })
    .populate("courseId");
    
    const transactions = await Transaction.find({
      tutorId,
      status: "completed",
    })
    .populate({
      path: "user",
      select: "-password" // exclude password
    })
    .populate("courseId");
    

    const studentMap = new Map();

    // Combine all transactions and map them by user ID
    [...payLater, ...transactions].forEach((enroll) => {
      if (enroll.user) {
        const userId = enroll.user._id.toString();
        if (!studentMap.has(userId)) {
          studentMap.set(userId, {
            student: enroll.user,
            transactions: [],
          });
        }
        studentMap.get(userId).transactions.push(enroll);
      }
    });

    const students = Array.from(studentMap.values());

    res.status(200).json({ students });
  } catch (err) {
    console.error("Error fetching student list:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.user.id;

    // Fetch PayLater transactions
    const payLater = await PayLater.find({
      tutorId,
      status: { $in: ["accepted", "completed", "pending for tutor acceptance"] },
    })
      .sort({ createdAt: -1 })
      .populate("user") // get name and image
      .populate("courseId");

    // Fetch completed Transactions
    const transactions = await Transaction.find({
      tutorId,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("courseId");

    // Merge and sort by time
    const combined = [...payLater, ...transactions].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Keep only latest per student
    const seenStudents = new Set();
    const notifications = [];

    for (const tx of combined) {
      // if (!tx.user || seenStudents.has(tx.user._id.toString())) continue;
      // seenStudents.add(tx.user._id.toString());

      notifications.push({
        id: tx._id,
        student: tx.user.name,
        image: tx.user.profilePicture || "https://placehold.it/45x45",
        course: tx.courseId?.name || "Unknown Course",
        time: tx.createdAt,
        read: false,
      });
    }

    res.status(200).json({ notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// router.get("/courses/:courseId/tutors", async (req, res) => {
//   try {
//     const tutors = await Tutor.find();
//     res.json(tutors);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch tutors" });
//   }
// });

// router.get("/tutors/:tutorId/available-dates", async (req, res) => {
//   try {
//     const { tutorId } = req.params;

//     let availableDates = new Set(); // Using Set to store unique dates

//     if (tutorId === "no-preference") {
//       // Fetch all tutors
//       const tutors = await Tutor.find();
//       tutors.forEach((tutor) => {
//         tutor.availability.forEach(({ date }) => {
//           availableDates.add(date);
//         });
//       });
//     } else {
//       // Fetch specific tutor
//       const tutor = await Tutor.findById(tutorId);
//       if (!tutor) {
//         return res.status(404).json({ error: "Tutor not found" });
//       }
//       tutor.availability.forEach(({ date }) => {
//         availableDates.add(date);
//       });
//     }

//     // Convert set to array and filter for next 2 months
//     const today = new Date();
//     const twoMonthsLater = new Date();
//     twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

//     availableDates = [...availableDates].filter((date) => {
//       const dateObj = new Date(date);
//       return dateObj >= today && dateObj <= twoMonthsLater;
//     });

//     res.json(availableDates);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch available dates" });
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
//       const formattedDate = new Date(date).toISOString().split("T")[0]; // Normalize date format
//       let existingDate = tutor.availability.find(
//         (entry) =>
//           new Date(entry.date).toISOString().split("T")[0] === formattedDate
//       );

//       if (existingDate) {
//         timeSlots.forEach((slot) => {
//           if (
//             !existingDate.timeSlots.some(
//               (existingSlot) =>
//                 existingSlot.startTime === slot.startTime &&
//                 existingSlot.endTime === slot.endTime
//             )
//           ) {
//             existingDate.timeSlots.push(slot);
//           }
//         });
//       } else {
//         tutor.availability.push({
//           date: new Date(formattedDate), // Store only date, no time
//           timeSlots,
//         });
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

// router.get("/tutors/:tutorId/available-dates", async (req, res) => {
//   try {
//     const { tutorId } = req.params;
//     const { subject } = req.query; // Get subject from query parameters

//     let availableDates = new Set(); // Using Set to store unique dates

//     if (tutorId === "no-preference") {
//       if (!subject) {
//         return res
//           .status(400)
//           .json({ error: "Subject is required for no preference" });
//       }

//       // Fetch tutors who teach the selected subject
//       const tutors = await Tutor.find({ subjects: subject });

//       tutors.forEach((tutor) => {
//         tutor.availability.forEach(({ date }) => {
//           availableDates.add(date);
//         });
//       });
//     } else {
//       // Fetch specific tutor
//       const tutor = await Tutor.findById(tutorId);
//       if (!tutor) {
//         return res.status(404).json({ error: "Tutor not found" });
//       }
//       tutor.availability.forEach(({ date }) => {
//         availableDates.add(date);
//       });
//     }

//     // Convert set to array and filter for the next 2 months
//     const today = new Date();
//     const twoMonthsLater = new Date();
//     twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

//     availableDates = [...availableDates].filter((date) => {
//       const dateObj = new Date(date);
//       return dateObj >= today && dateObj <= twoMonthsLater;
//     });

//     res.json(availableDates);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch available dates" });
//   }
// });

// router.get("/tutors/:tutorId/available-slots", async (req, res) => {
//   try {
//     const { tutorId } = req.params;
//     const { date } = req.query;

//     if (!date) {
//       return res.status(400).json({ error: "Date is required" });
//     }

//     let availableSlots = new Set(); // Using Set to avoid duplicate slots

//     // Ensure the date is in the same format (YYYY-MM-DD)
//     const formattedDate = new Date(date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD format

//     if (tutorId === "no-preference") {
//       // Fetch time slots from all tutors for the given date
//       const tutors = await Tutor.find();
//       tutors.forEach((tutor) => {
//         // Match only the date part (YYYY-MM-DD) by converting the stored date to ISO string and comparing the date part
//         const selectedDate = tutor.availability.find((entry) => {
//           const entryDate = new Date(entry.date).toISOString().split("T")[0]; // Convert stored date to YYYY-MM-DD
//           return entryDate === formattedDate; // Compare the date part only
//         });
//         if (selectedDate) {
//           selectedDate.timeSlots.forEach((slot) => availableSlots.add(slot));
//         }
//       });
//     } else {
//       // Fetch specific tutor's time slots
//       const tutor = await Tutor.findById(tutorId);
//       if (!tutor) {
//         return res.status(404).json({ error: "Tutor not found" });
//       }

//       const selectedDate = tutor.availability.find((entry) => {
//         const entryDate = new Date(entry.date).toISOString().split("T")[0]; // Convert stored date to YYYY-MM-DD
//         return entryDate === formattedDate; // Compare the date part only
//       });

//       if (!selectedDate) {
//         return res
//           .status(404)
//           .json({ error: "No available slots for this date" });
//       }

//       selectedDate.timeSlots.forEach((slot) => availableSlots.add(slot));
//     }

//     res.json([...availableSlots]); // Convert Set to Array and return
//   } catch (error) {
//     console.error("Error fetching tutor-specific slots:", error);
//     res.status(500).json({ error: "Failed to fetch available time slots" });
//   }
// });

// router.get("/tutors/:tutorId", async (req, res) => {
//   const tutor = await Tutor.findById(req.params.tutorId);
//   if (!tutor) return res.status(404).json({ message: "Tutor not found" });
//   res.json(tutor);
// });

// router.delete("/tutors/:tutorId/availability/date/:date", async (req, res) => {
//   const { tutorId, date } = req.params;

//   console.log("🗑️ Received delete request for date:", date);

//   try {
//     // Convert date from request to a Date object (ignoring time)
//     const formattedDate = new Date(date).toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'

//     // Find the tutor by ID
//     const tutor = await Tutor.findById(tutorId);
//     if (!tutor) {
//       return res.status(404).json({ error: "Tutor not found" });
//     }

//     // Normalize tutor availability dates
//     const filteredAvailability = tutor.availability.filter(
//       (entry) =>
//         new Date(entry.date).toISOString().split("T")[0] !== formattedDate
//     );

//     if (filteredAvailability.length === tutor.availability.length) {
//       return res.status(404).json({ error: "Date not found in availability" });
//     }

//     tutor.availability = filteredAvailability;
//     await tutor.save();

//     return res.json({
//       message: "Date deleted successfully",
//       updatedAvailability: tutor.availability,
//     });
//   } catch (error) {
//     console.error("❌ Error deleting date:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.delete(
//   "/tutors/:tutorId/availability/date/:date/time/:time",
//   async (req, res) => {
//     const { tutorId, date, time } = req.params;

//     console.log("🗑️ Received delete request for:", date, time);

//     try {
//       // Find the tutor by ID
//       const tutor = await Tutor.findById(tutorId);
//       if (!tutor) {
//         return res.status(404).json({ error: "Tutor not found" });
//       }

//       // Convert the date in params to a Date object for proper comparison
//       const dateObj = new Date(date);

//       // Find the date entry
//       const availabilityEntry = tutor.availability.find(
//         (entry) => new Date(entry.date).toISOString() === dateObj.toISOString()
//       );

//       if (!availabilityEntry) {
//         return res
//           .status(404)
//           .json({ error: "Date not found in availability" });
//       }

//       // Ensure time is compared correctly (assumes time is an object with an _id or another unique property)
//       const timeSlotId = time; // Adjust this based on how time is structured (use _id or other unique field)

//       // Remove the specified time slot
//       const updatedTimeSlots = availabilityEntry.timeSlots.filter(
//         (t) => t._id.toString() !== timeSlotId // Ensure comparison by _id if time is an object
//       );

//       if (updatedTimeSlots.length === availabilityEntry.timeSlots.length) {
//         return res.status(404).json({ error: "Time slot not found" });
//       }

//       // If all time slots are removed, delete the entire date entry
//       if (updatedTimeSlots.length === 0) {
//         tutor.availability = tutor.availability.filter(
//           (entry) => entry.date !== dateObj.toISOString() // Match by ISO string for consistency
//         );
//       } else {
//         availabilityEntry.timeSlots = updatedTimeSlots;
//       }

//       await tutor.save();
//       return res.json({
//         message: "Time slot deleted successfully",
//         updatedAvailability: tutor.availability,
//       });
//     } catch (error) {
//       console.error("❌ Error deleting time slot:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// );
