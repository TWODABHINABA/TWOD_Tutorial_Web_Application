import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export const formatDate = (date) => {
  const validDate = date instanceof Date ? date : new Date(date);
  return (
    validDate.getFullYear() +
    "-" +
    String(validDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(validDate.getDate()).padStart(2, "0")
  );
};

const EnrollmentCalendar = ({ availableDates, selectedDate, onChange }) => {
  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const dateString = formatDate(date); // Convert calendar date
      // console.log("Checking date:", dateString);
      // console.log("Available dates:", availableDates);

      return !availableDates.some(
        (availableDate) => formatDate(availableDate) === dateString
      );
    }
    return false;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Calendar
        onChange={(date) => {
          console.log("Selected Date from Calendar:", date); // Debugging
          onChange(formatDate(date)); // Ensure conversion
        }}
        value={selectedDate ? new Date(selectedDate) : null}
        tileDisabled={tileDisabled}
        className="react-calendar"
      />
    </div>
  );
};

export default EnrollmentCalendar;
