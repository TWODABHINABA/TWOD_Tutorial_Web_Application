import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../components/User-management/api";
import CustomNavbar from "../../components/navbar/Navbar";
import CustomFooter from "../../components/footer/Footer";

const CourseSummaryPage = () => {
  // Retrieve state passed from the CourseDetailsPage
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure the enrollment details from navigation state
  const {
    course,
    selectedSession,
    selectedTutor,
    selectedDate,
    selectedTimeSlot,
    selectedDuration,
  } = location.state || {};

  // Function to initiate payment and enrollment
  const handleEnrollNow = async () => {
    if (
      !selectedDate ||
      !selectedTimeSlot ||
      !selectedDuration ||
      !selectedSession
    ) {
      alert("Please select all options before enrolling.");
      return;
    }
    if (!token) {
      alert("Authentication error: Please log in first.");
      return;
    }
    try {
      const response = await api.post(
        `/courses/${course._id}/enroll`,
        {
          tutorId: selectedTutor || null, // ✅ Allow "No Preference" (null tutor)
          selectedDate,
          selectedTime: selectedTimeSlot,
          duration: selectedDuration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { approval_url } = response.data;
      if (approval_url) {
        window.location.href = approval_url; // ✅ Redirect to PayPal
      } else {
        alert("Error: No approval URL received.");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      alert(
        error.response?.data?.message || "Enrollment failed. Try again later."
      );
    }
  };

  // Function to handle "Pay Later"
  const handlePayLater = () => {
    alert("Enrollment saved. You can complete the payment later.");
    navigate("/"); // Adjust this route as needed
  };

  // Basic check if course data is missing
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No course data available. Please try again.</p>
      </div>
    );
  }

  return (
    <>
    <CustomNavbar/>
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Course Summary</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        {/* Display Course Details */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{course.name}</h2>
          <p className="text-gray-700">{course.overview}</p>
        </div>
        {/* Display Selected Session */}
        {selectedSession && (
          <div className="mb-4">
            <p className="font-semibold">Session:</p>
            <p>
              {selectedSession.duration} | Price: $
              {selectedSession.price || course.price}
            </p>
          </div>
        )}
        {/* Display Tutor Selection */}
        {selectedTutor && (
          <div className="mb-4">
            <p className="font-semibold">Tutor Selected:</p>
            <p>{selectedTutor}</p>
          </div>
        )}
        {/* Display Selected Date */}
        {selectedDate && (
          <div className="mb-4">
            <p className="font-semibold">Selected Date:</p>
            <p>{new Date(selectedDate).toLocaleDateString()}</p>
          </div>
        )}
        {/* Display Selected Time Slot */}
        {selectedTimeSlot && (
          <div className="mb-4">
            <p className="font-semibold">Time Slot:</p>
            <p>{selectedTimeSlot}</p>
          </div>
        )}
        {/* Display Selected Duration */}
        {selectedDuration && (
          <div className="mb-4">
            <p className="font-semibold">Duration:</p>
            <p>{selectedDuration}</p>
          </div>
        )}

        {/* Payment Buttons */}
        <div className="flex justify-between mt-6">
          <button
                              onClick={handleEnrollNow}
                              className="w-full py-2 bg-green-500 text-white rounded mt-4"
                            >
                              Confirm & Pay
                            </button>
          <button
            onClick={handlePayLater}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Pay Later
          </button>
        </div>
      </div>
    </div>
    <CustomFooter/>
    </>
  );
};

export default CourseSummaryPage;
