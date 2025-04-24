const express = require("express");
const router = express.Router();
const authMiddleware = require("../Auth/Authentication");
const sendEmail = require("../emailService");
const paypal = require("../config/paypal");
const GlobalSessionPricing = require("../Models/GlobalSessionPricing");
const Transaction = require("../Models/transaction");
const moment = require("moment");

// Import models
const PayLater = require("../Models/payLater");
const Course = require("../Models/course");
// Import person model to ensure it’s registered
const Person = require("../Models/person");
const Tutor = require("../Models/tutors");

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

const findAvailableTutor = async (subject, selectedDate, selectedTime) => {
  const selectedStartTime = convertTo24HourFormat(
    selectedTime.split("-")[0].trim()
  ); // "19:30"
  const selectedEndTime = convertTo24HourFormat(
    selectedTime.split("-")[1].trim()
  ); // "20:30"

  const tutors = await Tutor.find({
    "availability.date": selectedDate, // Match date
    "availability.subjects.subjectName": subject, // Match subject
  });

  for (const tutor of tutors) {
    for (const subjectEntry of tutor.availability) {
      if (subjectEntry.date.toISOString().split("T")[0] === selectedDate) {
        for (const subj of subjectEntry.subjects) {
          if (subj.subjectName === subject) {
            for (const slot of subj.timeSlots) {
              if (
                slot.startTime <= selectedStartTime &&
                slot.endTime >= selectedEndTime
              ) {
                return tutor; // ✅ Found matching tutor
              }
            }
          }
        }
      }
    }
  }

  return null; // No available tutor
};

// POST: Book a Pay Later session
router.post("/paylater/book", authMiddleware, async (req, res) => {
  try {
    console.log("hello paylater book");

    let { courseId, tutorId, selectedDate, selectedTime, duration, bonus } =
      req.body;

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

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (!tutorId) {
      // Auto-assign a tutor
      const assignedTutor = await findAvailableTutor(
        course.courseType,
        selectedDate,
        selectedTime
      );

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
    if (!courseId || !tutorId || !selectedDate || !selectedTime || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not found in token." });
    }

    const booking = new PayLater({
      courseId,
      tutorId,
      amount: formattedPrice,
      user: userId,
      status: "pending for tutor acceptance",
      selectedDate,
      selectedTime,
      duration,
      bonus,
    });

    await booking.save();

    res
      .status(201)
      .json({ message: "Booking request submitted", data: booking });
  } catch (err) {
    console.error("❌ Error creating Pay Later booking:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Tutor views requests (populating person and course data)
// router.get("/paylater/tutor-request", authMiddleware, async (req, res) => {
//   try {
//     const tutorId = req.user.id;
//     console.log("👤 Tutor ID from token:", tutorId);

//     const bookings = await PayLater.find({ tutorId })
//       .populate("user", "name email")
//       .populate("courseId", "name courseType")
//       .populate("tutorId")

//     console.log("✅ Bookings for this tutor:", bookings);
//     res.status(200).json({ data: bookings });
//   } catch (err) {
//     console.error("❌ Error fetching tutor bookings:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/paylater/tutor-request", authMiddleware, async (req, res) => {
  try {
    const tutorId = req.user.id;
    console.log("👤 Tutor ID from token:", tutorId);

    let bookings = await PayLater.find({ tutorId })
      .populate("user", "name email")
      .populate("courseId", "name courseType")
      .populate("tutorId");

    const now = moment();

    for (let booking of bookings) {
      // const bookingDateTime = moment(`${booking.selectedDate} ${booking.selectedTime}`, "YYYY-MM-DD hh:mm A");
      const startTime = booking.selectedTime.split("-")[0].trim(); // "06:30 PM"
      const bookingDateTime = moment(
        `${booking.selectedDate} ${startTime}`,
        "YYYY-MM-DD hh:mm A"
      );

      if (
        booking.status === "pending for tutor acceptance" &&
        bookingDateTime.isBefore(now)
      ) {
        booking.status = "rejected";
        await booking.save();

        console.log(`⏰ Auto-rejected expired booking: ${booking._id}`);

        // Send email to user
        await sendEmail(
          booking.user.email,
          `Your Pay Later Request has been rejected`,
          `
Hi ${booking.user.name},

Your Pay Later request for the course "${booking.courseId.name}" was automatically rejected because the tutor did not respond before the session time.

You may explore and rebook this or other courses from our platform at your convenience.

Course Details:
- Course Name: ${booking.courseId.name} ${booking.courseId.courseType}

Tutor Details:
- Name: ${booking.tutorId?.name || "Assigned Tutor"}
- Email: ${booking.tutorId?.email || "N/A"}

If you have any questions, feel free to contact us at support@twodtutorials.com.

Best regards,  
Team TWOD Tutorials
          `
        );
      }
    }

    // Refresh after potential updates
    bookings = await PayLater.find({ tutorId })
      .populate("user", "name email")
      .populate("courseId", "name courseType")
      .populate("tutorId");

    console.log("✅ Bookings for this tutor:", bookings);
    res.status(200).json({ data: bookings });
  } catch (err) {
    console.error("❌ Error fetching tutor bookings:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT: Tutor updates request status
// router.put("/paylater/:id/status", authMiddleware, async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!["accepted", "rejected"].includes(status)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid status. Use 'accepted' or 'rejected'." });
//     }

//     const updated = await PayLater.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     )
//       .populate("user", "name email")
//       .populate("courseId", "name courseType")
//       .populate("tutorId", "name email");

//     console.log(`✏️ Updating booking ${req.params.id} to status: ${status}`);

//     if (!updated) {
//       return res.status(404).json({ message: "Booking request not found" });
//     } else {
//       await sendEmail(
//         updated.user.email,
//         `Your Pay Later Request has been ${status}`,
//         `
// Hi ${updated.user.name},

// Your Pay Later request for the course "${updated.courseId.name}" has been ${status} by the tutor.

// ${
//   status === "accepted"
//     ? `You can now proceed with the next steps to begin your learning journey.`
//     : `We're sorry to inform you that the tutor has rejected your request. Feel free to explore other courses on our platform.`
// }

// Course Details:
// - Course Name: ${updated.courseId.name} ${updated.courseId.cousrseType}

// Tutor Details:
// - Name: ${updated.tutorId?.name || "Assigned Tutor"}
// - Email: ${updated.tutorId?.email || "N/A"}

// If you have any questions, feel free to contact us at support@twodtutorials.com.

// Best regards,
// Team TWOD Tutorials
//         `
//       );
//     }

//     res.status(200).json({ message: `Request ${status}`, data: updated });
//   } catch (err) {
//     console.error("Error updating status:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.put("/paylater/:id/status", authMiddleware, async (req, res) => {
  try {
    let { status } = req.body;

    const booking = await PayLater.findById(req.params.id)
      .populate("user", "name email")
      .populate("courseId", "name courseType")
      .populate("tutorId", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking request not found" });
    }

    const startTime = booking.selectedTime.split("-")[0].trim();
    const bookingDateTime = moment(
      `${booking.selectedDate} ${startTime}`,
      "YYYY-MM-DD hh:mm A"
    );
    const now = moment();
    console.log(`🕓 Now: ${now.format()}, Booking Time: ${bookingDateTime.format()}`);

    if (
      booking.status === "pending for tutor acceptance" &&
      bookingDateTime.isBefore(now)
    ) {
      status = "rejected";
      console.log(
        `⏰ Booking is in the past, auto-rejecting booking ${booking._id}`
      );
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status. Use 'accepted' or 'rejected'." });
    }

    booking.status = status;
    await booking.save();

    console.log(`✏️ Updating booking ${booking._id} to status: ${status}`);

    await sendEmail(
      booking.user.email,
      `Your Pay Later Request has been ${status}`,
      `
Hi ${booking.user.name},

Your Pay Later request for the course "${booking.courseId.name}" has been ${status} by the tutor.

${
  status === "accepted"
    ? `You can now proceed with the next steps to begin your learning journey.`
    : `We're sorry to inform you that the tutor has rejected your request. Feel free to explore other courses on our platform.`
}

Course Details:
- Course Name: ${booking.courseId.name} ${booking.courseId.courseType}

Tutor Details:
- Name: ${booking.tutorId?.name || "Assigned Tutor"}
- Email: ${booking.tutorId?.email || "N/A"}

If you have any questions, feel free to contact us at support@twodtutorials.com.

Best regards,  
Team TWOD Tutorials
      `
    );

    res.status(200).json({ message: `Request ${status}`, data: booking });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/payLater/:id/payNow", authMiddleware, async (req, res) => {
  try {
    const transactionId = req.params.id;

    const transaction = await PayLater.findOne({
      _id: transactionId,
      user: req.user.id,
    }).populate("courseId");

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "No accepted transaction found." });
    }

    const globalPricing = await GlobalSessionPricing.findOne();
    if (!globalPricing) {
      return res.status(404).json({ message: "Session pricing not found" });
    }

    const selectedSession = globalPricing.sessions.find(
      (session) => session.duration === transaction.duration
    );
    if (!selectedSession) {
      return res.status(400).json({ message: "Invalid session duration" });
    }

    const amount = selectedSession.price;
    const formattedPrice = parseFloat(amount).toFixed(2);

    const course = await Course.findById(transaction.courseId);

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
          description: `Enrollment for course ${course.name}, Duration: ${transaction.duration}.`,
        },
      ],
    };

    paypal.payment.create(paymentJson, async (error, payment) => {
      if (error) {
        console.error("PayPal error:", error);
        return res.status(500).json({ message: "Payment creation failed" });
      }

      const approvalUrl = payment.links.find(
        (link) => link.rel === "approval_url"
      );
      console.log(approvalUrl);
      if (approvalUrl) {
        try {
          return res.json({ approval_url: approvalUrl.href });
        } catch (err) {
          console.error("Error updating transaction status:", err);
          return res
            .status(500)
            .json({ message: "Failed to update transaction status." });
        }
      } else {
        return res.status(500).json({ message: "No approval URL found" });
      }
    });
  } catch (err) {
    console.error("Error in payNow route:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
