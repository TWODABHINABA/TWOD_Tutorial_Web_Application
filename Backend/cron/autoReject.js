const cron = require("node-cron");
const moment = require("moment");
const PayLater = require("../Models/payLater"); // adjust if needed
const Tutor = require("../Models/tutors");

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





const cleanOutdatedAvailability = async () => {
  try {
    const now = moment();

    const tutors = await Tutor.find({});

    for (const tutor of tutors) {
      let updatedAvailability = [];

      for (const availabilityEntry of tutor.availability) {
        const date = moment(availabilityEntry.date).startOf("day");

        // If the date is before today, skip it
        if (date.isBefore(now.clone().startOf("day"))) continue;

        let updatedSubjects = [];

        for (const subject of availabilityEntry.subjects) {
          let updatedGrades = [];

          for (const grade of subject.grades) {
            const filteredTimeSlots = grade.timeSlots.filter(slot => {
              const slotDateTime = moment(`${availabilityEntry.date.toISOString().split('T')[0]} ${slot.startTime}`, "YYYY-MM-DD hh:mm A");
              return slotDateTime.isAfter(now);
            });

            if (filteredTimeSlots.length > 0) {
              updatedGrades.push({
                grade: grade.grade,
                timeSlots: filteredTimeSlots,
              });
            }
          }

          if (updatedGrades.length > 0) {
            updatedSubjects.push({
              subjectName: subject.subjectName,
              grades: updatedGrades,
            });
          }
        }

        if (updatedSubjects.length > 0) {
          updatedAvailability.push({
            date: availabilityEntry.date,
            subjects: updatedSubjects,
          });
        }
      }

      tutor.availability = updatedAvailability;
      await tutor.save();
    }

    console.log("Outdated tutor availability cleaned up.");
  } catch (error) {
    console.error("Error cleaning tutor availability:", error.message);
  }
};


cron.schedule("0 * * * *", () => {
  console.log("🔁 Running auto-reject job...");
  autoRejectOutdatedBookings();
  cleanOutdatedAvailability();
});





