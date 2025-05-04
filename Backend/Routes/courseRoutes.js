const express = require("express");
const router = express.Router();
const Course = require("../Models/course");
const Person = require("../Models/person");
const Tutor = require("../Models/tutors");
const authMiddleware = require("../Auth/Authentication");
const paypal = require("../config/paypal");
const Transaction = require("../Models/transaction");
const payLater = require("../Models/payLater");
const GlobalSessionPricing = require("../Models/GlobalSessionPricing");
const multer = require("multer");
const path = require("path");
const { plus_v1 } = require("googleapis");

const storage = multer.diskStorage({
  destination: "courseUploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const courseUploads = multer({ storage });

router.post(
  "/add",
  authMiddleware,
  courseUploads.fields([
    { name: "courseTypeImage", maxCount: 1 },
    { name: "nameImage", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("Role:", req.user.role);
    console.log("Request Body:", req.body);
    console.log("Files:", req.files);

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only the admin can add courses!" });
    }

    try {
      const {
        courseType,
        name,
        overview,
        description,
        price,
        discountPrice,
        duration,
        level,
      } = req.body;

      const curriculumData = JSON.parse(req.body.curriculum || "[]");

      const courseTypeImage = req.files["courseTypeImage"]
        ? `/courseUploads/${req.files["courseTypeImage"][0].filename}`
        : "";
      const nameImage = req.files["nameImage"]
        ? `/courseUploads/${req.files["nameImage"][0].filename}`
        : "";

      const newCourse = new Course({
        courseType,
        name,
        overview,
        description,
        curriculum: curriculumData,
        price: Number(price) || 0,
        discountPrice: Number(discountPrice) || 0,
        duration,
        instructor: req.user.name,
        level,
        feedbacks: [],
        courseTypeImage,
        nameImage,
      });

      await newCourse.save();
      res
        .status(201)
        .json({ message: "Course added successfully", course: newCourse });
      console.log("New Course Added:", newCourse);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.put("/courses/update/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const updatedData = req.body;

  try {
    const course = await Course.findByIdAndUpdate(courseId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/courses/:id/feedback", authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const feedback = {
      user: req.user.id,
      name: req.user.name,
      profilePicture: req.user.profilePicture,
      rating,
      comment,
    };

    course.feedbacks.push(feedback);
    await course.save();

    res.json({ message: "Feedback added successfully", course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "feedbacks.user",
      "name"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const { name, courseType } = req.query;

    if (!name || !courseType) {
      return res
        .status(400)
        .json({ message: "Course name and type are required" });
    }

    const course = await Course.findOne({
      name: new RegExp(`^${name}$`, "i"),
      courseType: new RegExp(`^${courseType}$`, "i"), // make it case-insensitive if needed
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    console.log(course);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/allCourses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

router.get("/subjects", async (req, res) => {
  try {
    const subjects = await Course.distinct("courseType"); // Get unique course types
    res.json(subjects);
  } catch (error) {
    console.error("❌ Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

// router.get("/category/:categoryName", async (req, res) => {
//   try {
//     const { categoryName } = req.params;
//     const courses = await Course.find({ courseType: categoryName });
//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.get("/categories", async (req, res) => {
  try {
    const categories = await Course.aggregate([
      {
        $group: {
          _id: "$courseType",
          courses: {
            $push: {
              name: "$name",
              courseType: "$courseType", // still store for later use
              nameImage: "$nameImage",
            },
          },
          courseTypeImage: { $first: "$courseTypeImage" }, // pick first image for category
        },
      },
    ]);

    const formattedCategories = categories.map((cat) => ({
      category: cat._id,
      courseTypeImage: cat.courseTypeImage
        ? // `https://twod-tutorial-web-application-3brq.onrender.com${cat.courseTypeImage}` //Abhi
          `https://twod-tutorial-web-application-3brq.onrender.com${cat.courseTypeImage}` ||
          `http://localhost:6001${cat.courseTypeImage}`
        : null,
      courses: cat.courses.map((course) => ({
        name: course.name,
        courseType: course.courseType,
        nameImage: course.nameImage
          ? `https://twod-tutorial-web-application-3brq.onrender.com${course.nameImage}` ||
            `http://localhost:6001${course.nameImage}`
          : null,
      })),
    }));

    res.json(formattedCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});


const convertTo24HourFormat = (time12h) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = String(parseInt(hours) + 12);
  } else if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours}:${minutes}`;
};

const findAvailableTutor = async (subject, grade, selectedDate, selectedTime) => {
  const selectedStartTime = convertTo24HourFormat(
    selectedTime.split("-")[0].trim()
  );
  const selectedEndTime = convertTo24HourFormat(
    selectedTime.split("-")[1].trim()
  );

  const tutors = await Tutor.find({
    "availability.date": selectedDate,
    "availability.subjects.subjectName": subject,
    "availability.subjects.grades.grade": grade,
  });
console.log("Tutors found:", tutors);
  for (const tutor of tutors) {
    for (const subjectEntry of tutor.availability) {
      if (new Date(subjectEntry.date).toISOString().split("T")[0] === selectedDate) {
        for (const subj of subjectEntry.subjects) {
          if (subj.subjectName === subject) {
            for (const gradeEntry of subj.grades) {
              if (gradeEntry.grade === grade) {
                for (const slot of gradeEntry.timeSlots) {
                  if (
                    slot.startTime <= selectedStartTime &&
                    slot.endTime >= selectedEndTime
                  ) {
                    return tutor;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return null; // ❌ No match found
};

// Updated Enrollment Route
router.post("/courses/:id/enroll", authMiddleware, async (req, res) => {
  try {
    let { tutorId, selectedDate, selectedTime, duration } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const globalPricing = await GlobalSessionPricing.findOne();
    if (!globalPricing) {
      return res.status(404).json({ message: "Session pricing not found" });
    }

    const selectedSession = globalPricing.sessions.find(
      (session) => session.duration === duration
    );
    if (!selectedSession) {
      return res.status(400).json({ message: "Invalid session duration" });
    }

    let amount = selectedSession.price;
    const formattedPrice = parseFloat(amount.replace(/,/g, "")).toFixed(2);
    console.log(formattedPrice);

    if (!tutorId) {
      // Auto-assign a tutor
      const assignedTutor = await findAvailableTutor(
        course.courseType,
        course.name,
        selectedDate,
        selectedTime


      );
      console.log("Assigned Tutor:", assignedTutor);      

      if (!assignedTutor) {
        return res.status(400).json({
          error: "No tutors available for the selected date and time.",
        });
      }

      tutorId = assignedTutor._id;
      console.log(
        `🎉 Auto-assigned tutor: ${tutorId} | Date: ${selectedDate} | Time: ${selectedTime}`
      );
    }

    const transaction = new Transaction({
      courseId: course._id,
      user: req.user.id,
      amount: formattedPrice,
      tutorId,
      selectedDate,
      selectedTime,
      duration,
      status: "pending",
    });
    await transaction.save();

    const paymentJson = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `https://twod-tutorial-web-application-phi.vercel.app/success?transactionId=${transaction._id}`,
        cancel_url: `https://twod-tutorial-web-application-phi.vercel.app/cancel?transactionId=${transaction._id}`,
        // return_url: `http://localhost:5173/success?transactionId=${transaction._id}`,
        // cancel_url: `http://localhost:5173/cancel?transactionId=${transaction._id}`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: `Course Enrollment: ${course.name}`,
                sku: course._id.toString(),
                price: formattedPrice,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: formattedPrice,
          },
          description: `Enrollment for course ${course.name}, Duration: ${duration}.`,
        },
      ],
    };

    paypal.payment.create(paymentJson, (error, payment) => {
      if (error) {
        console.error("Error creating payment:", error);
        return res.status(500).json({ error: "Payment creation failed" });
      } else {
        const approvalUrl = payment.links.find((link) => link.rel === "approval_url");
        if (approvalUrl) {
          return res.json({ approval_url: approvalUrl.href });
        } else {
          return res.status(500).json({ error: "No approval URL found" });
        }
      }
    });
  } catch (err) {
    console.error("Error processing enrollment:", err);
    res.status(500).json({ error: err.message });
  }
});



router.get("/success", authMiddleware, async (req, res) => {
  try {
    const { paymentId, PayerID, transactionId } = req.query;

    if (!paymentId || !PayerID || !transactionId) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const execute_payment_json = { payer_id: PayerID };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async (error, payment) => {
        if (error) {
          console.error("Error executing PayPal payment:", error);
          return res.status(500).json({ error: "Payment execution failed" });
        }

        console.log("✅ Payment successful:", payment);

        let transaction = await Transaction.findById(transactionId);

        if (!transaction) {
          const payLaterTx = await payLater.findById(transactionId);
          if (!payLaterTx) {
            return res.status(404).json({ message: "Transaction not found" });
          }

          // Create a new Transaction entry
          transaction = new Transaction({
            user: payLaterTx.user,
            tutorId: payLaterTx.tutorId,
            courseId: payLaterTx.courseId,
            status: "completed",
            selectedDate: payLaterTx.selectedDate,
            selectedTime: payLaterTx.selectedTime,
            duration: payLaterTx.duration,
            amount: payLaterTx.amount,
            createdAt: new Date()
          });

          await transaction.save();

          // Delete the PayLater entry
          await payLater.findByIdAndDelete(transactionId);
        } else {
          transaction.status = "completed";
          await transaction.save();
        }
        await Person.findByIdAndUpdate(transaction.user, {
          $addToSet: { purchasedCourses: transaction.courseId }
        });

        const course = await Course.findById(transaction.courseId);
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }

        if (!course.students) course.students = [];

        if (!course.students.includes(req.user.id)) {
          course.students.push(req.user.id);
          await course.save();
        }

        return res.json({
          success: true,
          message: "Payment verified successfully",
          transactionId: transaction._id,
          status: "completed",
        });
      }
    );
  } catch (err) {
    console.error("Error processing PayPal success:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/cancel", authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.query;

    if (!transactionId) { 
      return res.status(400).json({ message: "Missing transaction ID" });
    }

    let transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      transaction = await payLater.findById(transactionId);
      if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.status = "failed";
    await transaction.save();

    return res.redirect(
      `https://twod-tutorial-web-application-phi.vercel.app/cancel?transactionId=${transaction._id}` 
      // ||
      //   `http://localhost:5173/cancel?transactionId=${transaction._id}`
      // `https://twod-tutorial-web-application-phi.vercel.app/cancel?transactionId=${transaction._id}`
    );
  } catch (err) {
    console.error("Error processing PayPal cancel:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/status/:transactionId", authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.params;

    let transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      transaction = await payLater.findById(transactionId);
      if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      transactionId: transaction._id,
      status: transaction.status,
      courseId: transaction.courseId,
    });
  } catch (err) {
    console.error("Error fetching transaction details:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/user/courses", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // 1. Fetch user with receivedAssignments
    const user = await Person.findById(userId).populate({
      path: "receivedAssignments.assignment",
      model: "assignment",
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Fetch completed transactions
    const transactions = await Transaction.find({
      user: userId,
      status: "completed",
    })
      .populate("courseId")
      .populate({ path: "tutorId", select: "name" })
      .lean();

    const completedCourses = transactions.map((tx) => {
      const courseAssignments = user.receivedAssignments
        .filter((ra) => ra.course?.toString() === tx.courseId?._id?.toString())
        .map((ra) => ({
          assignmentId: ra.assignment?._id,
          title: ra.assignment?.title || "Untitled",
          description: ra.assignment?.description || "No description",
          fileUrl: ra.assignment?.fileUrl || "",
          subject: ra.subject,
          grade: ra.grade,
          receivedAt: ra.receivedAt,
        }));

      return {
        tid: tx._id,
        type: "completed",
        courseId: tx.courseId?._id || "Deleted",
        courseTypeTitle: tx.courseId?.courseType || "Deleted",
        courseTitle: tx.courseId?.name || "Deleted",
        courseDescription: tx.courseId?.description || "Deleted",
        coursePrice: tx.courseId?.price || "Deleted",
        amountPaid: tx.amount,
        tutorName: tx.tutorId?.name || "Not Selected",
        selectedDate: tx.selectedDate || "Not Selected",
        selectedTime: tx.selectedTime || "Not Selected",
        duration: tx.duration || "Not Selected",
        assignments: courseAssignments,
      };
    });

    // 3. Fetch PayLater transactions (pending + accepted)
    const payLaterCourses = await payLater.find({
      user: userId,
      status: { $in: ["pending for tutor acceptance", "accepted", "completed", "failed"] },
    })
      .populate("courseId")
      .populate({ path: "tutorId", select: "name" })
      .lean();

    const additionalCourses = payLaterCourses.map((pl) => {
      const courseAssignments = user.receivedAssignments
        .filter((ra) => ra.course?.toString() === pl.courseId?._id?.toString())
        .map((ra) => ({
          assignmentId: ra.assignment?._id,
          title: ra.assignment?.title || "Untitled",
          description: ra.assignment?.description || "No description",
          fileUrl: ra.assignment?.fileUrl || "",
          subject: ra.subject,
          grade: ra.grade,
          receivedAt: ra.receivedAt,
        }));

      return {
        tid: pl._id,
        type: pl.status,
        showPayNow: pl.status === "accepted",
        courseId: pl.courseId?._id || "Deleted",
        courseTypeTitle: pl.courseId?.courseType || "Deleted",
        courseTitle: pl.courseId?.name || "Deleted",
        courseDescription: pl.courseId?.description || "Deleted",
        coursePrice: pl.courseId?.price || "Deleted",
        amountPaid: pl.amount || 0,
        tutorName: pl.tutorId?.name || "Not Selected",
        selectedDate: pl.selectedDate || "Not Selected",
        selectedTime: pl.selectedTime || "Not Selected",
        duration: pl.duration || "Not Selected",
        assignments: courseAssignments,
      };
    });

    const allCourses = [...completedCourses, ...additionalCourses];

    if (!allCourses.length) {
      return res.status(404).json({ message: "No purchased courses found" });
    }

    res.json(allCourses);
  } catch (err) {
    console.error("Error fetching user courses:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Add new route to get grades for a subject
router.get("/courses/subject/:subjectName", async (req, res) => {
  try {
    const { subjectName } = req.params;
    
    if (!subjectName) {
      return res.status(400).json({ message: "Subject name is required" });
    }

    // Find all courses for the given subject
    const courses = await Course.find({ 
      courseType: subjectName 
    }).select('name courseType -_id'); // Only select name and courseType fields

    if (!courses || courses.length === 0) {
      return res.status(404).json({ 
        message: `No courses found for subject: ${subjectName}` 
      });
    }

    // Extract unique grades from courses
    const grades = [...new Set(courses.map(course => course.name))];

    res.json({
      subject: subjectName,
      grades: grades
    });
  } catch (error) {
    console.error("Error fetching grades for subject:", error);
    res.status(500).json({ 
      error: "Failed to fetch grades for subject",
      details: error.message 
    });
  }
});

module.exports = router;




// if (!tutorId) {
    //   const tutors = await Tutor.find({ subjects: course.courseType });

    //   if (tutors.length === 0) {
    //     return res
    //       .status(400)
    //       .json({ error: "No tutors available for this course" });
    //   }

    //   const today = new Date();
    //   const nextMonth = new Date();
    //   nextMonth.setMonth(today.getMonth() + 1);

    //   let availableTutorsWithDates = [];

    //   tutors.forEach((tutor) => {
    //     tutor.availability.forEach((entry) => {
    //       const entryDate = new Date(entry.date);
    //       if (entryDate >= today && entryDate <= nextMonth) {
    //         availableTutorsWithDates.push({
    //           tutorId: tutor._id,
    //           date: entry.date,
    //           timeSlots: entry.timeSlots,
    //         });
    //       }
    //     });
    //   });

    //   if (availableTutorsWithDates.length === 0) {
    //     return res
    //       .status(400)
    //       .json({ error: "No available tutors in the next month" });
    //   }

    //   const selectedTutorData =
    //     availableTutorsWithDates[
    //       Math.floor(Math.random() * availableTutorsWithDates.length)
    //     ];
    //   tutorId = selectedTutorData.tutorId;

    //   console.log(
    //     `🎉 Auto-assigned tutor: ${tutorId} | Date: ${selectedDate} | Time: ${selectedTime}`
    //   );
    // }