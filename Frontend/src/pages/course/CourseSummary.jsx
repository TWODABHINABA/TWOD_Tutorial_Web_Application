import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../components/User-management/api";
import PaymentFooter from "../../components/footer/PaymentFooter";
import PaymentNavbar from "../../components/navbar/PaymentNavbar";

const CourseSummaryPage = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const {
    course,
    selectedSession,
    selectedTutor, // assume this is the tutor's ID
    selectedDate,
    selectedTimeSlot,
    selectedDuration,
  } = location.state || {};

  // New state to store tutor name
  const [tutorNameDisplay, setTutorNameDisplay] = useState("");
  // State for About Tutor modal
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [tutorData, setTutorData] = useState(null);
  const [loadingTutor, setLoadingTutor] = useState(false);
  const [errorTutor, setErrorTutor] = useState(null);
  // State for description expansion toggle in modal
  const [descExpanded, setDescExpanded] = useState(false);

  // Fetch tutor name on mount if selectedTutor exists
  useEffect(() => {
    if (selectedTutor) {
      api
        .get(`/tutors/${selectedTutor}`)
        .then((response) => {
          setTutorNameDisplay(response.data.name);
        })
        .catch((err) => {
          console.error("Failed to fetch tutor name", err);
          setTutorNameDisplay("Tutor");
        });
    }
  }, [selectedTutor]);

  // Function to fetch tutor details when modal is shown
  const fetchTutorDetails = async () => {
    setLoadingTutor(true);
    try {
      const response = await api.get(`/tutors/${selectedTutor}`);
      setTutorData(response.data);
    } catch (err) {
      setErrorTutor(
        err.response?.data?.error || "Failed to fetch tutor details."
      );
    } finally {
      setLoadingTutor(false);
    }
  };

  const handleShowTutorModal = () => {
    setShowTutorModal(true);
    if (!tutorData) {
      fetchTutorDetails();
    }
  };

  const handleCloseTutorModal = () => {
    setShowTutorModal(false);
  };

  // const handleEnrollNow = async () => {
  //   if (
  //     !selectedDate ||
  //     !selectedTimeSlot ||
  //     !selectedDuration ||
  //     !selectedSession
  //   ) {
  //     alert("Please select all options before enrolling.");
  //     return;
  //   }
  //   if (!token) {
  //     alert("Please log in first.");
  //     navigate("/login");
  //     return;
  //   }
  //   try {
  //     console.log({
  //       tutorId: selectedTutor,
  //       selectedDate,
  //       selectedTime: selectedTimeSlot,
  //       duration: selectedDuration,
  //     });
  //     const { data } = await api.post(
  //       `/courses/${course._id}/enroll`,
  //       {
  //         tutorId: selectedTutor,
  //         selectedDate,
  //         selectedTime: selectedTimeSlot,
  //         duration: selectedDuration,
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     if (data.approval_url) window.location.href = data.approval_url;
  //     else alert("Payment URL not received.");
  //   } catch (err) {
  //     console.error(err);
  //     alert(err.response?.data?.message || "Enrollment failed.");
  //   }
  // };

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
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    // ✅ Format selectedDate correctly (YYYY-MM-DD)
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

    // ✅ Ensure tutorId is null when 'No Preference' is selected
    const tutorIdToSend =
      selectedTutor === "No Preference" ? null : selectedTutor;

    try {
      console.log("Sending Enrollment Data:", {
        tutorId: tutorIdToSend,
        selectedDate: formattedDate, // ✅ Correct date format
        selectedTime: selectedTimeSlot, // ✅ Ensure 12-hour AM/PM format
        duration: selectedDuration,
      });

      const { data } = await api.post(
        `/courses/${course._id}/enroll`,
        {
          tutorId: tutorIdToSend,
          selectedDate: formattedDate, // ✅ Send correctly formatted date
          selectedTime: selectedTimeSlot, // ✅ Ensure time is in 12-hour format
          duration: selectedDuration,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.approval_url) {
        window.location.href = data.approval_url;
      } else {
        alert("Payment URL not received.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Enrollment failed.");
    }
  };

  const handlePayLater = () => {
    alert("Enrollment saved. You can pay later.");
    navigate("/");
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          No course data available. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PaymentNavbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-[#e89a55] mb-8 max-sm:hidden">
            Course Summary
          </h1>

          <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Subject</dt>
                <dd className="mt-1 text-gray-700">{course.courseType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Course</dt>
                <dd className="mt-1 text-gray-900">{course.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Session</dt>
                <dd className="mt-1 text-gray-900">
                  {selectedSession.duration}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="mt-1 text-gray-900">
                  ${selectedSession.price ?? course.price}
                </dd>
              </div>
              {selectedTutor && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tutor</dt>
                  <dd className="mt-1 text-gray-900">{tutorNameDisplay}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-gray-900">
                  {new Date(selectedDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Time Slot</dt>
                <dd className="mt-1 text-gray-900">{selectedTimeSlot}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-gray-900">{selectedDuration}</dd>
              </div>
            </dl>

            {/* Button container: About Tutor on left, enrollment buttons on right */}
            <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
              <button
                onClick={handleShowTutorModal}
                className="w-full md:w-auto px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
              >
                About Tutor
              </button>
              <div className="flex gap-4">
                <button
                  onClick={handleEnrollNow}
                  className="max-sm:px-1 max-sm:text-base w-full md:w-auto px-6 py-3 bg-[#e89a55] hover:bg-[#D35400] text-white font-semibold rounded-lg transition"
                >
                  Confirm &amp; Pay
                </button>
                <button
                  onClick={handlePayLater}
                  className="max-sm:px-0 max-sm:text-base w-full md:w-auto px-6 py-3 bg-white hover:bg-gray-100 text-[#e89a55] border border-[#e89a55] font-semibold rounded-lg transition"
                >
                  Pay Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PaymentFooter />

      {/* Modal for About Tutor */}
      {showTutorModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4"
          onClick={handleCloseTutorModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 relative max-h-[calc(100vh-100px)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseTutorModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            {loadingTutor ? (
              <p className="text-center text-gray-500">
                Loading tutor details...
              </p>
            ) : errorTutor ? (
              <p className="text-center text-red-500">{errorTutor}</p>
            ) : tutorData ? (
              <div className="flex flex-col items-center">
                <img
                  src={
                    tutorData.profilePicture.startsWith("http")
                      ? tutorData.profilePicture
                      : `https://twod-tutorial-web-application-3brq.onrender.com${tutorData.profilePicture}` ||
                        `http://localhost:6001${tutorData.profilePicture}`
                  }
                  alt={tutorData.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-orange-500"
                />
                <h2 className="text-xl font-bold text-orange-500">
                  {tutorData.name}
                </h2>
                {tutorData.subjects && tutorData.subjects.length > 0 && (
                  <div className="mt-4 w-full">
                    <h3 className="text-sm font-bold text-orange-500 text-center">
                      Areas of Expertise:
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {tutorData.subjects.map((subject, index) => (
                        <li
                          key={index}
                          className="text-xs text-gray-600 text-center"
                        >
                          • {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-2 text-center">
                  <p
                    className={`text-gray-700 ${
                      !descExpanded ? "line-clamp-2" : ""
                    }`}
                  >
                    {tutorData.description}
                  </p>
                  {tutorData.description.length > 150 && (
                    <button
                      onClick={() => setDescExpanded(!descExpanded)}
                      className="text-blue-500 text-xs mt-1"
                    >
                      {descExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No tutor details available.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSummaryPage;
