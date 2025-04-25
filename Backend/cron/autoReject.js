const cron = require("node-cron");
const moment = require("moment");
const PayLater = require("../Models/payLater"); // adjust if needed

const autoRejectOutdatedBookings = async () => {
  try {
    const now = moment();

    const pendingBookings = await PayLater.find({
      status: "pending for tutor acceptance",
    });

    for (const booking of pendingBookings) {
      const startTime = booking.selectedTime?.split("-")[0]?.trim();
      const bookingDateTime = moment(`${booking.selectedDate} ${startTime}`, "YYYY-MM-DD hh:mm A");

      if (bookingDateTime.isBefore(now)) {
        booking.status = "rejected";
        await booking.save();

        console.log(`⏰ Auto-rejected booking ${booking._id} (was outdated)`);
      }
    }
  } catch (error) {
    console.error("❌ Cron job error:", error.message);
  }
};

// 🔁 Run every hour
cron.schedule("0 * * * *", () => {
  console.log("🔁 Running auto-reject job...");
  autoRejectOutdatedBookings();
});