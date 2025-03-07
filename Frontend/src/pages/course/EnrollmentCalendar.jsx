import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
const formatDate = (date) => date.toISOString().split("T")[0];

const EnrollmentCalendar = ({ availableDates, selectedDate, onChange }) => {
  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const dateString = formatDate(date);
      return !availableDates.includes(dateString);
    }
    return false;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Calendar
        onChange={(date) => onChange(formatDate(date))}
        value={selectedDate ? new Date(selectedDate) : null}
        tileDisabled={tileDisabled}
        className="react-calendar"
      />
    </div>
  );
};

export default EnrollmentCalendar;
