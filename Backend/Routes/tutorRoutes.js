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

    const tempPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newTutor = new Tutor({
      email,
      password: hashedPassword,
      name,
      profilePicture: null,
      description: null,
      subjects: [],
    });

    await newTutor.save();

    const plainText = `
Hi ${name},

Welcome to TWOD Tutorials! We're excited to have you on board as a tutor.

Below are your login credentials:
- Email (Username): ${email}
- Password: ${tempPassword}

To get started, please follow these steps:

1. Click on the following link to access the tutor portal:
   https://twod-tutorial-web-application-nine.vercel.app/

2. On the homepage, navigate to the Login section.

3. Log in using the credentials provided above.

4. Reset your password.

If you have any questions or need assistance, feel free to reach out to us at support@twodtutorials.com.

We're thrilled to have you with us!

Best regards,  
Team TWOD Tutorials
`;

    const htmlContent = `
<p>Hi ${name},</p>

<p>Welcome to <strong>TWOD Tutorials</strong>! We're excited to have you on board as a tutor.</p>

<p><strong>Your login credentials:</strong></p>
<ul>
  <li><strong>Email:</strong> ${email}</li>
  <li><strong>Password:</strong> ${tempPassword}</li>
</ul>

<p><strong>Steps to get started:</strong></p>
<ol>
  <li>Visit the tutor portal: <a href="https://twod-tutorial-web-application-nine.vercel.app/">Click Here</a></li>
  <li>Go to the <strong>Login</strong> section.</li>
  <li>Enter your credentials above.</li>
  <li>Reset your password after logging in.</li>
</ol>

<p>If you have any questions, feel free to email us at <a href="mailto:support@twodtutorials.com">support@twodtutorials.com</a>.</p>

<p>We're thrilled to have you with us!</p>

<p><strong>Team TWOD Tutorials</strong></p>
`;

    await sendEmail(
      email,
      "Welcome to TWOD Tutorials!",
      plainText,
      htmlContent
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

    const tutors = await Tutor.find({ subjects: course.courseType });

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


router.get("/tutors/:id", async (req, res) => {
  const tutorId = req.params.id;

  // Handle cases where user didn’t select any tutor (frontend default)
  if (!tutorId || tutorId === "No Preference") {
    return res.status(400).json({ error: "Please select a tutor." });
  }

  try {
    const tutor = await Tutor.findById(tutorId).select(
      "name profilePicture description subjects phone birthday"
    );

    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found." });
    }

    res.json(tutor);
  } catch (error) {
    console.error("Error fetching tutor:", error);
    res.status(500).json({ error: "Server error fetching tutor." });
  }
});


router.get("/tutors/availability", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.user.id; // Get logged-in tutor's ID
    const { subject, grade } = req.query; // Optional subject and grade filter

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Filter availability by subject and grade (if provided)
    const filteredAvailability = tutor.availability
      .map((entry) => ({
        date: entry.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD
        subjects: entry.subjects
          .filter((sub) => !subject || sub.subjectName === subject)
          .map((sub) => ({
            subjectName: sub.subjectName,
            grades: sub.grades.filter((g) => !grade || g.grade === grade),
          }))
          .filter((sub) => sub.grades.length > 0),
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

    for (const { date, subject, grade, timeSlots } of availability) {
      const formattedDate = new Date(date).toISOString().split("T")[0];

      // Check if the tutor already has availability for the selected date
      let existingDate = tutor.availability.find(
        (entry) =>
          new Date(entry.date).toISOString().split("T")[0] === formattedDate
      );

      if (!existingDate) {
        // If date doesn't exist, add new date with the subject and grade
        tutor.availability.push({
          date: new Date(formattedDate),
          subjects: [{
            subjectName: subject,
            grades: [{
              grade: grade,
              timeSlots: timeSlots
            }]
          }],
        });
      } else {
        // Check if the tutor already has a time slot for another subject/grade on the same date
        for (const existingSubject of existingDate.subjects) {
          for (const existingGrade of existingSubject.grades) {
            for (const slot of timeSlots) {
              const conflict = existingGrade.timeSlots.some(
                (existingSlot) =>
                  existingSlot.startTime === slot.startTime &&
                  existingSlot.endTime === slot.endTime
              );
              if (conflict) {
                return res.status(400).json({
                  error: `Conflict detected! You have already added ${slot.startTime} - ${slot.endTime} for ${existingSubject.subjectName} (${existingGrade.grade}).`,
                });
              }
            }
          }
        }

        // Add the new subject and time slots if no conflict exists
        let subjectEntry = existingDate.subjects.find(
          (sub) => sub.subjectName === subject
        );

        if (!subjectEntry) {
          existingDate.subjects.push({
            subjectName: subject,
            grades: [{
              grade: grade,
              timeSlots: timeSlots
            }]
          });
        } else {
          let gradeEntry = subjectEntry.grades.find(
            (g) => g.grade === grade
          );

          if (!gradeEntry) {
            subjectEntry.grades.push({
              grade: grade,
              timeSlots: timeSlots
            });
          } else {
            gradeEntry.timeSlots.push(...timeSlots);
          }
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
    console.log("Fetching available dates for tutor:", tutorId);
    const { subject, grade } = req.query;

    console.log("🔍 Fetching available dates with params:", {
      tutorId,
      subject,
      grade
    });

    let availableDates = new Set(); 

    if (tutorId === "no-preference") {
      if (!subject) {
        console.log("❌ Subject is required for no preference");
        return res
          .status(400)
          .json({ error: "Subject is required for no preference" });
      }

      // Fetch tutors who teach the selected subject
      const tutors = await Tutor.find({ subjects: subject });

      tutors.forEach((tutor) => {
        tutor.availability.forEach(({ date, subjects }) => {
          subjects.forEach((subj) => {
            if (subj.subjectName === subject) {
              // If grade is provided, check if the subject has that grade
              if (!grade || subj.grades.some(g => g.grade === grade)) {
                availableDates.add(date);
              }
            }
          });
        });
      });
    } else {
      // Fetch specific tutor
      const tutor = await Tutor.findById(tutorId);
      if (!tutor) {
        console.log("❌ Tutor not found:", tutorId);
        return res.status(404).json({ error: "Tutor not found" });
      }
      tutor.availability.forEach(({ date, subjects }) => {
        subjects.forEach((subj) => {
          if (subj.subjectName === subject) {
            // If grade is provided, check if the subject has that grade
            if (!grade || subj.grades.some(g => g.grade === grade)) {
              availableDates.add(date);
            }
          }
        });
      });
    }

    // Convert set to array and filter for the next 6 months
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC
    
    const sixMonthsLater = new Date();
    sixMonthsLater.setUTCMonth(sixMonthsLater.getUTCMonth() + 6);
    sixMonthsLater.setUTCHours(23, 59, 59, 999); // Set to end of day in UTC


    availableDates = [...availableDates].filter((date) => {
      const dateObj = new Date(date);
      dateObj.setUTCHours(0, 0, 0, 0); // Normalize to start of day in UTC
      const isInRange = dateObj >= today && dateObj <= sixMonthsLater;
      return isInRange;
    });
    console.log("📅 Final filtered available dates:", availableDates);
    res.json(availableDates);
  } catch (error) {
    console.error("❌ Error in available-dates route:", error);
    res.status(500).json({ error: "Failed to fetch available dates" });
  }
});

router.get("/tutors/no-preference/available-dates", async (req, res) => {
  try {
    const { subject, grade } = req.query;

    console.log("🔍 Fetching available dates for no-preference with params:", {
      subject,
      grade
    });

    if (!subject) {
      console.log("❌ Subject is required for no-preference");
      return res
        .status(400)
        .json({ error: "Subject is required for no-preference" });
    }

    let availableDates = new Set();

    // Fetch tutors who teach the selected subject
    const tutors = await Tutor.find({ subjects: subject });
    console.log("📢 Found tutors for subject:", tutors.length);
    // console.log("📢 Tutors found:", tutors.map(t => ({ 
    //   name: t.name, 
    //   subjects: t.subjects,
    //   availability: t.availability.length 
    // })));

    tutors.forEach((tutor) => {
      console.log("🔍 Checking tutor:", tutor.name);
      tutor.availability.forEach(({ date, subjects }) => {
        console.log("📅 Checking date:", date);
        subjects.forEach((subj) => {
          console.log("📚 Checking subject:", subj.subjectName);
          if (subj.subjectName === subject) {
            console.log("✅ Found matching subject:", subject);
            // If grade is provided, check if the subject has that grade
            if (!grade || subj.grades.some(g => g.grade === grade)) {
              console.log("✅ Found matching grade:", grade);
              availableDates.add(date);
            }
          }
        });
      });
    });

    // Convert set to array and filter for the next 6 months
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC
    
    const sixMonthsLater = new Date();
    sixMonthsLater.setUTCMonth(sixMonthsLater.getUTCMonth() + 6);
    sixMonthsLater.setUTCHours(23, 59, 59, 999); // Set to end of day in UTC

    console.log("📅 Date range:", {
      today: today,
      sixMonthsLater: sixMonthsLater
    });
    console.log("📅 All available dates before filtering:", [...availableDates]);

    availableDates = [...availableDates].filter((date) => {
      const dateObj = new Date(date);
      dateObj.setUTCHours(0, 0, 0, 0); // Normalize to start of day in UTC
      const isInRange = dateObj >= today && dateObj <= sixMonthsLater;
      console.log("📅 Date check:", {
        date: dateObj,
        isInRange: isInRange
      });
      return isInRange;
    });

    console.log("📅 Final filtered available dates:", availableDates);

    res.json(availableDates);
  } catch (error) {
    console.error("❌ Error in no-preference available-dates route:", error);
    res.status(500).json({ error: "Failed to fetch available dates" });
  }
});

router.get("/tutors/:tutorId/available-slots", async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { date, subject, grade } = req.query;

    

    if (!date || !subject) {
      console.log("❌ Missing required parameters");
      return res.status(400).json({ error: "Date and Subject are required" });
    }

    let availableSlots = [];
    const formattedDate = new Date(date).toISOString().split("T")[0];

    if (tutorId === "no-preference") {
      const tutors = await Tutor.find({ subjects: subject });

      tutors.forEach((tutor) => {
        

        const selectedDate = tutor.availability.find((entry) => {
          const entryDate = new Date(entry.date).toISOString().split("T")[0];
          return entryDate === formattedDate;
        });

        if (selectedDate) {
          selectedDate.subjects.forEach((s) => {
            if (s.subjectName === subject) {
              

              // Check for matching grade
              const matchingGrades = s.grades.filter(g => !grade || g.grade === grade);
              
              matchingGrades.forEach(g => {
                

                g.timeSlots.forEach(slot => {
                  

                  // Create slot object with all required fields
                  const slotObject = {
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    tutorName: tutor.name,
                    tutorId: tutor._id,
                    grade: g.grade
                  };

                  // Only add if both startTime and endTime are defined
                  if (slotObject.startTime && slotObject.endTime) {
                    availableSlots.push(slotObject);
                  } else {
                    console.log("⚠️ Skipping invalid slot:", slot);
                  }
                });
              });
            }
          });
        }
      });
    } else {
      const tutor = await Tutor.findById(tutorId);
      if (!tutor) {
        console.log("❌ Tutor not found:", tutorId);
        return res.status(404).json({ error: "Tutor not found" });
      }

      

      const selectedDate = tutor.availability.find((entry) => {
        const entryDate = new Date(entry.date).toISOString().split("T")[0];
        return entryDate === formattedDate;
      });

      if (!selectedDate) {
        return res.status(404).json({ error: "No available slots for this date" });
      }

      selectedDate.subjects.forEach((s) => {
        if (s.subjectName === subject) {
          

          // Check for matching grade
          const matchingGrades = s.grades.filter(g => !grade || g.grade === grade);
          
          matchingGrades.forEach(g => {
            

            g.timeSlots.forEach(slot => {
              

              // Create slot object with all required fields
              const slotObject = {
                startTime: slot.startTime,
                endTime: slot.endTime,
                tutorName: tutor.name,
                tutorId: tutor._id,
                grade: g.grade
              };

              // Only add if both startTime and endTime are defined
              if (slotObject.startTime && slotObject.endTime) {
                availableSlots.push(slotObject);
              } else {
                console.log("⚠️ Skipping invalid slot:", slot);
              }
            });
          });
        }
      });
    }

    // Remove duplicate slots and sort by time
    const uniqueSlots = Array.from(new Map(
      availableSlots.map(slot => [slot.startTime, slot])
    ).values()).sort((a, b) => a.startTime.localeCompare(b.startTime));

    

    res.json(uniqueSlots);
  } catch (error) {
    console.error("❌ Error fetching available slots:", error);
    res.status(500).json({ error: "Failed to fetch available time slots" });
  }
});

router.get("/tutors/no-preference/available-slots", async (req, res) => {
  try {
    const { date, subject, grade } = req.query;

    console.log("🔍 Fetching available slots for no-preference with params:", {
      date,
      subject,
      grade
    });

    if (!date || !subject) {
      console.log("❌ Missing required parameters");
      return res.status(400).json({ error: "Date and Subject are required" });
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];
    console.log("📅 Formatted date:", formattedDate);

    // Find all tutors who teach the subject
    const tutors = await Tutor.find({ subjects: subject });
    console.log("📢 Found tutors for subject:", tutors.length);
    // console.log("📢 Tutors found:", tutors.map(t => ({ 
    //   name: t.name, 
    //   subjects: t.subjects,
    //   availability: t.availability.length 
    // })));

    if (tutors.length === 0) {
      console.log("❌ No tutors found for subject:", subject);
      return res.status(404).json({ error: "No tutors available for this subject" });
    }

    let availableSlots = [];

    // Check each tutor's availability
    tutors.forEach((tutor) => {
      console.log("\n👤 Checking tutor:", {
        name: tutor.name,
        id: tutor._id,
        availability: tutor.availability
      });

      // Find matching date in tutor's availability
      const matchingDate = tutor.availability.find(entry => {
        if (!entry || !entry.date) {
          console.log("⚠️ Invalid date entry:", entry);
          return false;
        }
        const entryDate = new Date(entry.date).toISOString().split("T")[0];
        console.log("📅 Comparing dates:", {
          entryDate,
          formattedDate,
          matches: entryDate === formattedDate
        });
        return entryDate === formattedDate;
      });

      if (!matchingDate) {
        console.log("❌ No matching date found for tutor:", tutor.name);
        return;
      }

      console.log("📅 Found matching date:", matchingDate);
      
      // Find matching subject
      if (!matchingDate.subjects || !Array.isArray(matchingDate.subjects)) {
        console.log("❌ Invalid subjects array in date entry:", matchingDate.subjects);
        return;
      }

      console.log("📚 Available subjects:", matchingDate.subjects.map(s => s.subjectName));

      const matchingSubject = matchingDate.subjects.find(subj => {
        if (!subj || !subj.subjectName) {
          console.log("⚠️ Invalid subject entry:", subj);
          return false;
        }
        const matches = subj.subjectName === subject;
        console.log("📚 Comparing subjects:", {
          subjectName: subj.subjectName,
          targetSubject: subject,
          matches
        });
        return matches;
      });

      if (!matchingSubject) {
        console.log("❌ No matching subject found");
        return;
      }

      console.log("📚 Found matching subject:", matchingSubject);

      // Find matching grade
      if (!matchingSubject.grades || !Array.isArray(matchingSubject.grades)) {
        console.log("❌ Invalid grades array in subject entry:", matchingSubject.grades);
        return;
      }

      console.log("📚 Available grades:", matchingSubject.grades.map(g => g.grade));

      const matchingGrades = matchingSubject.grades.filter(g => {
        if (!g || !g.grade) {
          console.log("⚠️ Invalid grade entry:", g);
          return false;
        }
        const matches = !grade || g.grade === grade;
        console.log("📚 Comparing grades:", {
          grade: g.grade,
          targetGrade: grade,
          matches
        });
        return matches;
      });

      if (matchingGrades.length === 0) {
        console.log("❌ No matching grades found");
        return;
      }

      console.log("📚 Found matching grades:", matchingGrades);

      // Process each matching grade's time slots
      matchingGrades.forEach(g => {
        if (!g.timeSlots || !Array.isArray(g.timeSlots)) {
          console.log("❌ Invalid time slots array in grade entry:", g.timeSlots);
          return;
        }

        console.log("⏰ Available time slots:", g.timeSlots);

        g.timeSlots.forEach(slot => {
          if (!slot || !slot.startTime || !slot.endTime) {
            console.log("⚠️ Invalid time slot:", slot);
            return;
          }

          console.log("⏰ Processing slot:", {
            startTime: slot.startTime,
            endTime: slot.endTime,
            tutorName: tutor.name,
            tutorId: tutor._id,
            grade: g.grade
          });

          // Create slot object with all required fields
          const slotObject = {
            startTime: slot.startTime,
            endTime: slot.endTime,
            tutorName: tutor.name,
            tutorId: tutor._id,
            grade: g.grade
          };

          availableSlots.push(slotObject);
        });
      });
    });

    // Remove duplicate slots and sort by time
    const uniqueSlots = Array.from(new Map(
      availableSlots.map(slot => [slot.startTime + slot.tutorId, slot])
    ).values()).sort((a, b) => a.startTime.localeCompare(b.startTime));

    console.log("\n✅ Final available slots summary:", {
      totalSlots: uniqueSlots.length,
      slots: uniqueSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        tutorName: slot.tutorName,
        grade: slot.grade
      }))
    });

    if (uniqueSlots.length === 0) {
      console.log("❌ No available slots found after processing");
      return res.status(404).json({ error: "No available slots found for the selected criteria" });
    }

    res.json(uniqueSlots);
  } catch (error) {
    console.error("❌ Error fetching available slots:", error);
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

      const { subject, grade } = req.query; // Extract subject and grade from query
      const { date } = req.params; // Extract date from params
      const userId = req.user.id;
      const userRole = req.user.role;

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

      if (subject && grade) {
        // Remove only the subject's grade availability
        dateEntry.subjects = dateEntry.subjects.map(subjectEntry => {
          if (subjectEntry.subjectName === subject) {
            subjectEntry.grades = subjectEntry.grades.filter(
              gradeEntry => gradeEntry.grade !== grade
            );
          }
          return subjectEntry;
        }).filter(subjectEntry => subjectEntry.grades.length > 0);

        // If no subjects remain for the date, remove the date entry
        if (dateEntry.subjects.length === 0) {
          tutor.availability = tutor.availability.filter(
            (entry) => entry.date.toISOString().split("T")[0] !== date
          );
        }
      } else if (subject) {
        // Remove only the subject's availability
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
      const { subject, grade, tutorId } = req.query; // Extract from query params
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

      // Find the grade entry
      const gradeEntry = subjectEntry.grades.find(
        (g) => g.grade === grade
      );
      if (!gradeEntry) {
        return res
          .status(404)
          .json({ error: "Grade not found in availability" });
      }

      // Remove the specified time slot based on `startTime`
      const updatedTimeSlots = gradeEntry.timeSlots.filter(
        (slot) => slot.startTime !== time
      );

      if (updatedTimeSlots.length === gradeEntry.timeSlots.length) {
        return res.status(404).json({ error: "Time slot not found" });
      }

      // Update the grade's time slots
      gradeEntry.timeSlots = updatedTimeSlots;

      // If no time slots remain, remove the grade entry
      if (gradeEntry.timeSlots.length === 0) {
        subjectEntry.grades = subjectEntry.grades.filter(
          (g) => g.grade !== grade
        );
      }

      // If no grades remain, remove the subject entry
      if (subjectEntry.grades.length === 0) {
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
    const uniqueStudentIds = new Set();

    // const payLaterEnrollments = await PayLater.find({
    //   tutorId,
    //   status: {
    //     $in: ["accepted", "completed", "pending for tutor acceptance"],
    //   },
    // }).populate("courseId user");

    const payLaterEnrollments = await PayLater.find({ tutorId }).populate("courseId user");


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

    // const transactionEnrollments = await Transaction.find({
    //   tutorId,
    //   status: "completed",
    // }).populate("courseId user"); // 👈 also populate user

    const transactionEnrollments = await Transaction.find({ tutorId }).populate("courseId user");


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
      status: {
        $in: ["accepted", "completed", "pending for tutor acceptance"],
      },
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
      status: {
        $in: ["accepted", "completed", "pending for tutor acceptance"],
      },
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

router.get("/students", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.user.id;

    const payLater = await PayLater.find({ tutorId }) // 🔹 Filter by tutor ID
      .populate({
        path: "user",
        select: "-password",
      })
      .populate("courseId");

    const transactions = await Transaction.find({ tutorId }) // 🔹 Filter by tutor ID
      .populate({
        path: "user",
        select: "-password",
      })
      .populate("courseId");

    const allEnrollments = [...payLater, ...transactions];

    res.status(200).json({ students: allEnrollments });
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
      status: {
        $in: ["accepted", "completed", "pending for tutor acceptance"],
      },
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
        isRead: tx.isRead || false,
      });
    }

    res.status(200).json({ notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Assuming you use JWT and req.user._id is available
router.post(
  "/notifications/mark-all-read",
  authMiddleware,
  async (req, res) => {
    try {
      const tutorId = req.user.id;
      console.log(tutorId);

      const result1 = await PayLater.updateMany(
        {
          tutorId,
          $or: [{ isRead: false }, { isRead: { $exists: false } }],
        },
        { $set: { isRead: true } }
      );

      const result2 = await Transaction.updateMany(
        {
          tutorId,
          $or: [{ isRead: false }, { isRead: { $exists: false } }],
        },
        { $set: { isRead: true } }
      );

      console.log("PayLater updated:", result1.modifiedCount);
      console.log("Transaction updated:", result2.modifiedCount);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating notifications:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/all-class", authMiddleware, async (req, res) => {
  try {
    const tutorId  = req.user.id;

    // 🚫 Exclude these statuses
    const excludedStatuses = [
      "failed",
      "pending",
      "pending for tutor acceptance",
      "rejected",
    ];


    const payLaterStudents = await PayLater.find({
      tutorId,
      status: { $nin: excludedStatuses },
    })
      .populate("user", "name email")
      .populate("courseId", "name courseType")
      .populate("tutorId", "name") 
      .lean();


    const transactionStudents = await Transaction.find({
      tutorId,
      status: { $nin: ["failed", "pending"] },
    })
      .populate("user", "name email")
      .populate("courseId", "name courseType")
      .populate("tutorId", "name") 
      .lean();


    const formattedPayLater = payLaterStudents.map((entry) => ({
      studentName: entry.user?.name || "N/A",
      studentEmail: entry.user?.email || "N/A",
      courseName: entry.courseId?.name || "N/A",
      courseType: entry.courseId?.courseType || "N/A",
      timeSlot: entry.selectedTime || "N/A",
      selectedDate: entry.selectedDate || "N/A",
      status: entry.status,
      tutorName: entry.tutorId?.name || "N/A",
      source: "PayLater",
    }));

    const formattedTransaction = transactionStudents.map((entry) => ({
      studentName: entry.user?.name || "N/A",
      studentEmail: entry.user?.email || "N/A",
      courseName: entry.courseId?.name || "N/A",
      courseType: entry.courseId?.courseType || "N/A",
      timeSlot: entry.selectedTime || "N/A",
      selectedDate: entry.selectedDate || "N/A",
      status: entry.status,
      tutorName: entry.tutorId?.name || "N/A",
      source: "Transaction",
    }));


    const allStudents = [...formattedPayLater, ...formattedTransaction].sort(
      (a, b) => new Date(a.selectedDate) - new Date(b.selectedDate)
    );

    res.status(200).json({ success: true, students: allStudents });
  } catch (error) {
    console.error("Error fetching tutor students:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
