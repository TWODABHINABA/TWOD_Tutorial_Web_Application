const express = require("express");
const router = express.Router();
const Course = require("../Models/course");
const Tutor = require("../Models/tutors");
const authMiddleware = require("../Auth/Authentication");
const paypal = require("../config/paypal");
const Transaction = require("../Models/transaction");
const GlobalSessionPricing = require("../Models/GlobalSessionPricing");
const multer = require("multer");
const path = require("path");

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
        ? `http://localhost:6001${cat.courseTypeImage}` //Local
        : // ? `https://twod-tutorial-web-application-3brq.onrender.com${cat.courseTypeImage}` //Abhi
          null,
      courses: cat.courses.map((course) => ({
        name: course.name,
        courseType: course.courseType,
        nameImage: course.nameImage
          ? `http://localhost:6001${course.nameImage}` //Local
          : // ? `https://twod-tutorial-web-application-3brq.onrender.com${course.nameImage}`  //Abhi
            null,
      })),
    }));

    res.json(formattedCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});






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
    
    const selectedSession = globalPricing.sessions.find(session => session.duration === duration);
    if (!selectedSession) {
      return res.status(400).json({ message: "Invalid session duration" });
    }


    let amount = selectedSession.price;
    const formattedPrice = parseFloat(amount.replace(/,/g, '')).toFixed(2);
    console.log(formattedPrice);


    if (!tutorId) {

      const tutors = await Tutor.find({ subjects: course.courseType });

      if (tutors.length === 0) {
        return res.status(400).json({ error: "No tutors available for this course" });
      }

 
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);

      let availableTutorsWithDates = [];


      tutors.forEach((tutor) => {
        tutor.availability.forEach((entry) => {
          const entryDate = new Date(entry.date);
          if (entryDate >= today && entryDate <= nextMonth) {
            availableTutorsWithDates.push({
              tutorId: tutor._id,
              date: entry.date,
              timeSlots: entry.timeSlots, 
            });
          }
        });
      });

      if (availableTutorsWithDates.length === 0) {
        return res.status(400).json({ error: "No available tutors in the next month" });
      }

      const selectedTutorData = availableTutorsWithDates[Math.floor(Math.random() * availableTutorsWithDates.length)];
      tutorId = selectedTutorData.tutorId;


      console.log(`🎉 Auto-assigned tutor: ${tutorId} | Date: ${selectedDate} | Time: ${selectedTime}`);
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
        return_url: `http://localhost:5173/success?transactionId=${transaction._id}`,
        cancel_url: `http://localhost:5173/cancel?transactionId=${transaction._id}`,
        // return_url: `https://twod-tutorial-web-application-frontend.vercel.app/success?transactionId=${transaction._id}`,
        // cancel_url: `https://twod-tutorial-web-application-frontend.vercel.app/cancel?transactionId=${transaction._id}`,
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
        } else {
          console.log("✅ Payment successful:", payment);

          const transaction = await Transaction.findById(transactionId);
          if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
          }

          transaction.status = "completed";
          await transaction.save();

          const course = await Course.findById(transaction.courseId);
          if (!course) {
            return res.status(404).json({ message: "Course not found" });
          }

          if (!course.students) {
            course.students = [];
          }

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

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.status = "failed";
    await transaction.save();

    return res.redirect(
      `http://localhost:5173/cancel?transactionId=${transaction._id}`
      // `https://twod-tutorial-web-application-frontend.vercel.app/cancel?transactionId=${transaction._id}`
    );
  } catch (err) {
    console.error("Error processing PayPal cancel:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/status/:transactionId", authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
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
    console.log("Authenticated user:", req.user); // Debugging

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized. User not authenticated." });
    }

    const userId = req.user.id;

    const transactions = await Transaction.find({
      user: userId,
      status: "completed",
    })
      .populate("courseId")
      .populate({
        path: "tutorId",
        select: "name",
      })
      .lean();

    if (!transactions.length) {
      return res.status(404).json({ message: "No purchased courses found" });
    }

    // Handle possible nulls in courseId and tutorId
    const formattedCourses = transactions.map((transaction) => ({
      courseId: transaction.courseId?._id || "Deleted",
      courseTypeTitle: transaction.courseId?.courseType || "Deleted",
      courseTitle: transaction.courseId?.name || "Deleted",
      courseDescription: transaction.courseId?.description || "Deleted",
      coursePrice: transaction.courseId?.price || "Deleted",
      amountPaid: transaction.amount,
      tutorName: transaction.tutorId?.name || "Not Selected",
      selectedDate: transaction.selectedDate || "Not Selected",
      selectedTime: transaction.selectedTime || "Not Selected",
      duration: transaction.duration || "Not Selected",
    }));

    res.json(formattedCourses);
  } catch (err) {
    console.error("Error fetching purchased courses:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
