import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// const mobileArrowStyles = `
//   @media (max-width: 768px) {
//     /* Reduce arrow button width and remove extra spacing */
//     .react-calendar__navigation button {
//       width: 0 !important;
//       padding: 0 !important;
//       margin: 0 !important;
//     }
//     /* Reduce label spacing if needed */
//     .react-calendar__navigation__label {
//       margin: 0 0 !important;
//       font-size: 0.8rem;
//     }
//     /* Optionally adjust arrow icon margins */
//     .react-calendar__navigation__arrow {
//       margin: 0 !important;
//     }
//   }
// `;
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
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // <-- Update threshold as needed
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const dateString = formatDate(date); 
      // console.log("Checking date:", dateString);
      // console.log("Available dates:", availableDates);

      return !availableDates.some(
        (availableDate) => formatDate(availableDate) === dateString
      );
    }
    return false;
  };
  // const customFormatShortWeekday = (locale, date) => {
  //   if (isMobile) {
  //     // Abbreviated names for mobile
  //     const mobileWeekdays = ["s","m", "t", "w", "th", "f", "sa"];
  //     return mobileWeekdays[date.getDay()];
  //   }
  //   // Fallback for non-mobile: use default locale formatting for short weekday names
  //   return date.toLocaleDateString(locale, { weekday: "short" });
  // };

  return (
    <>
    {/* <style>{mobileArrowStyles}</style> */}
    <div className="p-4 bg-white rounded-lg  shadow-md  max-md:h-80 max-md:w-72 h-96 overflow-hidden">
      <Calendar
        onChange={(date) => {
          console.log("Selected Date from Calendar:", date);
          onChange(formatDate(date)); 
        }}
        value={selectedDate ? new Date(selectedDate) : null}
        tileDisabled={tileDisabled}
        className="react-calendar "
        // formatShortWeekday={customFormatShortWeekday} 
        // nextLabel={null}
        // prevLabel={null}
        // next2Label={null}
        // prev2Label={null}
      />
    </div>
    </>
  );
};

export default EnrollmentCalendar;
