const express = require("express");
const router = express.Router();
const Course = require("../Models/course");
const authMiddleware = require("../Auth/Authentication");
const paypal = require("../config/paypal");
const Transaction = require("../Models/transaction");
const multer = require("multer");
const path = require("path");

// const adminAuth=require("../Admin/AdminAuth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

router.post(
  "/add",
  authMiddleware,
  upload.fields([
    { name: "courseTypeImage", maxCount: 1 },
    { name: "nameImage", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("Role", req.user.role);
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
        curriculum,
        price,
        discountPrice,
        duration,
        level,
      } = req.body;
      const courseTypeImage = req.files["courseTypeImage"]
        ? `/uploads/${req.files["courseTypeImage"][0].filename}`
        : "";
      const nameImage = req.files["nameImage"]
        ? `/uploads/${req.files["nameImage"][0].filename}`
        : "";

      const newCourse = new Course({
        courseType,
        name,
        overview,
        description,
        curriculum,
        price,
        discountPrice,
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
      console.log(newCourse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post("/:id/feedback", authMiddleware, async (req, res) => {
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

router.get("/allCourses", async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses from MongoDB
    res.json(courses); // Send all courses as JSON
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const { name } = req.query; // Get course name from query params

    if (!name) {
      return res.status(400).json({ message: "Course name is required" });
    }

    // Find a course with the given name (case-insensitive)
    const course = await Course.findOne({ name: new RegExp(`^${name}$`, "i") });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    console.log(course);
    res.json(course); // Send the full course object, frontend will extract `_id`
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Course.aggregate([
      {
        $group: {
          _id: "$courseType", // Group by courseType
          courses: { $push: "$name" }, // Collect course names
        },
      },
    ]);

    // Format response
    const formattedCategories = categories.map((cat) => ({
      category: cat._id,
      courses: cat.courses,
    }));

    res.json(formattedCategories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/:id/enroll", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const price = course.discountPrice || course.price;
    const formattedPrice = Number(price).toFixed(2);

    const transaction = new Transaction({
      courseId: course._id,
      user: req.user.id,
      amount: formattedPrice,
      status: "pending",
    });
    await transaction.save();

    const paymentJson = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `http://localhost:5173/success?transactionId=${transaction._id}`,
        cancel_url: `http://localhost:5173/cancel?transactionId=${transaction._id}`,
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
          description: `Enrollment for course ${course.name}.`,
        },
      ],
    };

    console.log("Payment JSON:", paymentJson);

    paypal.payment.create(paymentJson, (error, payment) => {
      if (error) {
        console.error("Error creating payment:", error);
        return res.status(500).json({ error: "Payment creation failed" });
      } else {
        const approvalUrl = payment.links.find(
          (link) => link.rel === "approval_url"
        );
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
    const userId = req.user.id;

    const transactions = await Transaction.find({
      user: userId,
      status: "completed",
    });

    if (!transactions.length) {
      return res.status(404).json({ message: "No purchased courses found" });
    }

    const courseIds = transactions.map((t) => t.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } });

    res.json(courses);
  } catch (err) {
    console.error("Error fetching purchased courses:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
