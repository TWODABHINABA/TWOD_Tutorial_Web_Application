import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../components/User-management/api";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import "react-datepicker/dist/react-datepicker.css";
import EnrollmentCalendar from "./EnrollmentCalendar";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { formatDate } from "./EnrollmentCalendar";
import './courseDetail.css'
const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [feedback, setFeedback] = useState({ rating: "", comment: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDuration, setSelectedDuration] =
    useState("30 Minutes Session");
  const [sessions, setSessions] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null); // Track selected session
  const token = localStorage.getItem("token");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedCourse, setUpdatedCourse] = useState({});
  const isRoleAdmin = localStorage.getItem("role");
  console.log(courseId);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data);
        console.log(response.data);
        setUpdatedCourse({
          name: response.data.name,
          overview: response.data.overview,
          description: response.data.description,
          price: response.data.price,
          discountPrice: response.data.discountPrice,
          curriculum: response.data.curriculum || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  useEffect(() => {
    console.log("Available Dates from Backend:", availableDates);
  }, [availableDates]);

  const fetchSessions = async () => {
    try {
      const response = await api.get("/get-session");
      if (response.data.success) {
        setSessions(response.data.data.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setSelectedDuration(session.duration);
  };
  const handleInputChange = (e) => {
    setUpdatedCourse((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (Object.keys(updatedCourse).length === 0) {
      alert("No changes made!");
      return;
    }

    try {
      const response = await api.put(`/courses/update/${courseId}`, {
        ...updatedCourse,
        curriculum: updatedCourse.curriculum || [],
      });
      setCourse(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      window.location.href = "/register";
    }
    try {
      const response = await api.post(
        `/courses/${courseId}/feedback`,
        feedback
      );
      setCourse(response.data.course);
      setFeedback({ rating: "", comment: "" });
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  const handleEnrollClick = async () => {
    try {
      const response = await api.get(`/courses/${courseId}/tutors`);
      console.log("Fetched Tutors:", response.data);
      setTutors(response.data);
      setShowEnrollModal(true);
    } catch (error) {
      console.error("❌ Error fetching tutors:", error);
    }
  };

  const filterAvailableSlots = (slots, duration) => {
    if (!slots || slots.length === 0 || !duration) return [];

    console.log("Filtering slots for duration:", duration);

    const durationMap = {
      "30 Minutes Session": 30,
      "1 Hour Session": 60,
      "1.5 Hour Session": 90,
      "2 Hour Session": 120,
    };
    const durationInMinutes = durationMap[duration];

    if (!durationInMinutes) {
      console.error("Invalid duration:", duration);
      return [];
    }

    const filteredSlots = [];

    slots.forEach((slot) => {
      let currentStartTime = new Date(`1970-01-01T${slot.startTime}:00`);
      const endTime = new Date(`1970-01-01T${slot.endTime}:00`);

      console.log(`Processing slot: ${slot.startTime} - ${slot.endTime}`);

      while (currentStartTime < endTime) {
        let nextStartTime = new Date(
          currentStartTime.getTime() + durationInMinutes * 60000
        );

        console.log(
          `Checking slot: ${currentStartTime.toLocaleTimeString()} - ${nextStartTime.toLocaleTimeString()}`
        );

        if (nextStartTime <= endTime) {
          filteredSlots.push({
            startTime: currentStartTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            endTime: nextStartTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }

        currentStartTime = nextStartTime;
      }
    });

    console.log("Final Filtered Slots:", filteredSlots);
    return filteredSlots;
  };

  const handleTutorSelection = async (tutorId) => {
    setSelectedTutor(tutorId);
    setSelectedDate("");
    setAvailableDates([]);
    setAvailableTimeSlots([]);
    setSelectedTimeSlot("");
    try {
      const response = await api.get(`/tutors/${tutorId}/available-dates`);
      setAvailableDates(response.data);
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
  };

  useEffect(() => {
    const fetchAvailableDates = async () => {
      let endpoint = "/tutors/no-preference/available-dates";
      try {
        const response = await api.get(endpoint);
        console.log("Available Dates (No Preference):", response.data);
        setAvailableDates(response.data);
      } catch (error) {
        console.error("Error fetching available dates:", error);
      }
    };

    if (selectedTutor === "") {
      fetchAvailableDates();
    }
  }, [selectedTutor]);

  const handleDateSelection = async (date) => {
    setSelectedDate(date);
    setAvailableTimeSlots([]);
    setSelectedTimeSlot("");

    const formattedDate = date.toISOString().split("T")[0];

    try {
      console.log("Selected Date:", formattedDate);

      const response = await api.get(
        `/tutors/${selectedTutor}/available-slots`,
        {
          params: { date: formattedDate },
        }
      );

      console.log("Raw Slots from Backend:", response.data);

      if (!selectedDuration) {
        console.error("No session duration selected");
        return;
      }

      console.log("Selected Duration:", selectedDuration);

      const filteredSlots = filterAvailableSlots(
        response.data,
        selectedDuration
      );
      setAvailableTimeSlots(filteredSlots);
    } catch (error) {
      console.error("Error fetching available time slots:", error);
    }
  };

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return;

      const formattedDate = selectedDate.toISOString().split("T")[0];

      let endpoint =
        selectedTutor === ""
          ? `/tutors/no-preference/available-slots`
          : `/tutors/${selectedTutor}/available-slots`;

      try {
        const response = await api.get(endpoint, {
          params: { date: formattedDate },
        });
        console.log("Available Slots:", response.data);

        if (!selectedDuration) {
          console.error("No session duration selected");
          return;
        }

        const filteredSlots = filterAvailableSlots(
          response.data,
          selectedDuration
        );
        setAvailableTimeSlots(filteredSlots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, selectedTutor]);

  const handleSessionDurationChange = (e) => {
    const selectedDuration = e.target.value;
    const session = sessions.find((s) => s.duration === selectedDuration);
    setSelectedSession(session);
    setSelectedDuration(selectedDuration);
  };

  useEffect(() => {
    if (selectedDate) {
      handleDateSelection(selectedDate);
    }
  }, [selectedDuration]);

  useEffect(() => {
    if (selectedTutor === "" && selectedDate && availableTimeSlots.length > 0) {
      console.log(
        "Re-filtering slots for No Preference due to session duration change..."
      );

      // Fetch available slots again and reapply filtering
      const fetchAndFilterSlots = async () => {
        try {
          const formattedDate = selectedDate.toISOString().split("T")[0];

          const response = await api.get(
            `/tutors/no-preference/available-slots`,
            {
              params: { date: formattedDate },
            }
          );

          console.log("Refetched Slots (No Preference):", response.data);

          const updatedSlots = filterAvailableSlots(
            response.data,
            selectedDuration
          );
          setAvailableTimeSlots(updatedSlots);
        } catch (error) {
          console.error("Error re-fetching available slots:", error);
        }
      };

      fetchAndFilterSlots();
    }
  }, [selectedDuration]);

  useEffect(() => {
    if (sessions.length > 0) {
      const defaultSession = sessions.find(
        (s) => s.duration === "30 Minutes Session"
      );
      if (defaultSession) {
        setSelectedSession(defaultSession);
        setSelectedDuration(defaultSession.duration);
        filterAvailableSlots(defaultSession.duration);
      }
    }
  }, [sessions]);

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

  // const formatPrice = (priceString) => {
  //   if (!priceString) return 0;

  //   const cleaned = priceString.replace(/[^\d]/g, "");
  //   return Number(cleaned);
  // };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={80} color="#3498db" />
      </div>
    );
  if (error) return <p>Error: {error}</p>;
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl">📚</div>
          <h2 className="text-3xl font-bold text-gray-800">Course not found</h2>
          <p className="text-gray-600">No details available for course</p>
          <Link
            to="/"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 font-sans animate-fade-in">
        {/* MOBILE LAYOUT */}
        <div className="block lg:hidden max-w-7xl mx-auto p-4 sm:p-6">
          {/* 1. Header with Back Button, Course Title, Overview & Grade */}
          <header className="mb-4 space-y-2">
            <Link
              to={`/category/${encodeURIComponent(course.category)}`}
              className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors duration-200 text-sm"
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to {course.category}
            </Link>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={updatedCourse.name}
                onChange={(e) =>
                  setUpdatedCourse((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent border border-orange-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            ) : (
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {course.name}
              </h1>
            )}
            {/* Brief course overview & grade (level) */}
            {isEditing ? (
              <textarea
                name="overview"
                value={updatedCourse.overview}
                onChange={(e) =>
                  setUpdatedCourse((prev) => ({
                    ...prev,
                    overview: e.target.value,
                  }))
                }
                className="text-sm text-gray-600 font-medium border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            ) : (
              <>
                <p className="text-sm text-gray-600">{course.overview}</p>
                <p className="text-xs text-gray-500">Grade: {course.level}</p>
              </>
            )}
          </header>
  
          {/* 2. Enroll Card */}
          <div className="mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              {selectedSession && (
                <div className="bg-gray-100 p-3 rounded-lg shadow-md mb-3">
                  <p className="text-base font-medium">
                    Selected Session:{" "}
                    <span className="font-bold">{selectedSession.duration}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Price: ${selectedSession?.price}
                  </p>
                </div>
              )}
              <div className="session-selector-container mb-3">
                <h2 className="text-xl font-semibold mb-2">
                  Choose a Session Duration
                </h2>
                <div className="flex gap-2 mb-4">
                  {sessions.map((session, index) => (
                    <button
                      key={index}
                      className={`p-2 border rounded text-xs ${
                        selectedSession?.duration === session.duration
                          ? "bg-orange-500 text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => {
                        setSelectedSession(session);
                        setSelectedDuration(session.duration);
                        filterAvailableSlots(session.duration);
                      }}
                    >
                      {session.duration}
                    </button>
                  ))}
                </div>
              </div>
              {token && (
                <div className="space-y-3">
                  <button
                    onClick={handleEnrollClick}
                    className="w-full py-3 text-orange-500 rounded-xl border-2 hover:text-white border-orange-500 font-semibold hover:bg-orange-500 transition-all duration-300 transform hover:scale-[1.02] text-sm"
                  >
                    Enroll Now
                  </button>
                  <button
                    onClick={() => alert("Previewing course...")}
                    className="w-full py-3 border-2 border-orange-500 text-orange-500 rounded-xl font-semibold hover:bg-orange-50 transition-colors duration-200 text-sm"
                  >
                    Preview Course
                  </button>
                </div>
              )}
            </div>
          </div>
  
          {/* 3. Course Image */}
          <div className="mb-4">
            <div className="w-full max-w-[650px] h-[250px] sm:h-[450px] overflow-hidden rounded-md shadow-md mx-auto">
              <img
                src={
                  `https://twod-tutorial-web-application-3brq.onrender.com${course.nameImage}` ||
                  `http://localhost:6001${course.nameImage}`
                }
                alt={course.nameImage}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
  
          {/* 4. Detailed Course Description */}
          <section className="mb-4 bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Course Overview
            </h3>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
                name="description"
                value={updatedCourse.description}
                onChange={handleInputChange}
                placeholder="Enter course description"
              />
            ) : (
              <p className="text-gray-600 text-sm">{course.description}</p>
            )}
          </section>
  
          {/* 5. Curriculum */}
          
          <section className="mb-4 space-y-4">
  <h3 className="text-2xl font-bold text-gray-800">Curriculum</h3>
  <div className="space-y-3">
    {course?.curriculum?.map((module, idx) => (
      <div
        key={idx}
        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
            <span className="text-orange-600 font-bold">{idx + 1}</span>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                name="sectionTitle"
                value={updatedCourse.curriculum?.[idx]?.sectionTitle || ""}
                onChange={(e) => {
                  setUpdatedCourse((prev) => {
                    const newCurriculum = prev.curriculum
                      ? [...prev.curriculum]
                      : [];
                    if (!newCurriculum[idx]) {
                      newCurriculum[idx] = {};
                    }
                    newCurriculum[idx] = {
                      ...newCurriculum[idx],
                      sectionTitle: e.target.value,
                    };
                    return { ...prev, curriculum: newCurriculum };
                  });
                }}
                className="w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
              />
            ) : (
              <h4 className="text-lg font-semibold text-gray-800">
                {module.sectionTitle}
              </h4>
            )}
            <ul className="mt-2 space-y-1">
              {module.lessons?.map((lecture, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors duration-200 text-xs"
                >
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={
                          updatedCourse.curriculum?.[idx]?.lessons?.[i]?.title || ""
                        }
                        onChange={(e) => {
                          setUpdatedCourse((prev) => {
                            const newCurriculum = prev.curriculum
                              ? [...prev.curriculum]
                              : [];
                            if (!newCurriculum[idx])
                              newCurriculum[idx] = { lessons: [] };
                            if (!newCurriculum[idx].lessons)
                              newCurriculum[idx].lessons = [];
                            if (!newCurriculum[idx].lessons[i])
                              newCurriculum[idx].lessons[i] = {};
                            newCurriculum[idx].lessons[i] = {
                              ...newCurriculum[idx].lessons[i],
                              title: e.target.value,
                            };
                            return { ...prev, curriculum: newCurriculum };
                          });
                        }}
                        className="w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-xs"
                      />
                      <input
                        type="text"
                        value={
                          updatedCourse.curriculum?.[idx]?.lessons?.[i]?.duration ||
                          ""
                        }
                        onChange={(e) => {
                          setUpdatedCourse((prev) => {
                            const newCurriculum = prev.curriculum
                              ? [...prev.curriculum]
                              : [];
                            if (!newCurriculum[idx])
                              newCurriculum[idx] = { lessons: [] };
                            if (!newCurriculum[idx].lessons)
                              newCurriculum[idx].lessons = [];
                            if (!newCurriculum[idx].lessons[i])
                              newCurriculum[idx].lessons[i] = {};
                            newCurriculum[idx].lessons[i] = {
                              ...newCurriculum[idx].lessons[i],
                              duration: e.target.value,
                            };
                            return { ...prev, curriculum: newCurriculum };
                          });
                        }}
                        className="w-16 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <span className="text-gray-600">{lecture.title}</span>
                      <span className="text-orange-600">{lecture.duration}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
            {module.quiz && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center text-orange-600 text-xs">
                  {isEditing ? (
                    <input
                      type="text"
                      value={updatedCourse.curriculum?.[idx]?.quiz || ""}
                      onChange={(e) => {
                        setUpdatedCourse((prev) => ({
                          ...prev,
                          curriculum:
                            prev.curriculum?.map((module, modIdx) =>
                              modIdx === idx
                                ? { ...module, quiz: e.target.value }
                                : module
                            ) || [],
                        }));
                      }}
                      className="w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-xs"
                    />
                  ) : (
                    <span className="text-gray-600">{module.quiz}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div> {/* Closing the outer div */}
</section>

  
            {/* 6. Feedback Form */}
            <section className="mb-4">
              <form
                onSubmit={handleFeedbackSubmit}
                className="space-y-4 bg-white p-4 rounded-xl shadow-sm"
              >
                <h3 className="text-base font-bold">Leave Your Feedback</h3>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() =>
                        setFeedback({ ...feedback, rating: star })
                      }
                      className={`w-6 h-6 ${
                        feedback.rating >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={feedback.comment}
                  onChange={(e) =>
                    setFeedback({ ...feedback, comment: e.target.value })
                  }
                  placeholder="Write your feedback..."
                  className="w-full p-2 border rounded-lg text-xs"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="text-orange-500 hover:text-white border border-orange-500 transition-colors py-2 px-4 rounded-lg hover:bg-orange-500 text-xs"
                >
                  Submit Feedback
                </button>
                {isRoleAdmin === "admin" && (
                  <>
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-500 text-xs"
                      >
                        Edit Course
                      </button>
                    ) : (
                      <button
                        type="submit"
                        onClick={(e) => {
                          setIsEditing(false);
                          handleUpdate(e);
                        }}
                        className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-500 text-xs"
                      >
                        Update
                      </button>
                    )}
                  </>
                )}
              </form>
            </section>
          </div>
  
          {/* DESKTOP LAYOUT */}
          <div className="hidden lg:block max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Desktop grid layout (unchanged) */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Header, Image, Description & Curriculum */}
              <div className="lg:col-span-2 space-y-6">
                <header className="mb-6">
                  <div className="space-y-2">
                    <Link
                      to={`/category/${encodeURIComponent(course.category)}`}
                      className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors duration-200 text-sm"
                    >
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back to {course.category}
                    </Link>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={updatedCourse.name}
                        onChange={(e) =>
                          setUpdatedCourse((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="text-2xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent border border-orange-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        {course.name}
                      </h1>
                    )}
                    {isEditing ? (
                      <textarea
                        name="overview"
                        value={updatedCourse.overview}
                        onChange={(e) =>
                          setUpdatedCourse((prev) => ({
                            ...prev,
                            overview: e.target.value,
                          }))
                        }
                        className="text-base sm:text-lg text-gray-600 font-medium border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <h2 className="text-base sm:text-lg text-gray-600 font-medium">
                        {course.overview}
                      </h2>
                    )}
                  </div>
                </header>
    
                <div className="grid gap-8">
                  <div className="w-full max-w-[650px] h-[450px] overflow-hidden rounded-md shadow-md mx-auto">
                    <img
                      src={
                        `https://twod-tutorial-web-application-3brq.onrender.com${course.nameImage}` ||
                        `http://localhost:6001${course.nameImage}`
                      }
                      alt={course.nameImage}
                      className="w-full h-full object-cover"
                    />
                  </div>
    
                  {isEditing ? (
                    <section className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">
                        Course Overview
                      </h3>
                      <textarea
                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                        name="description"
                        value={updatedCourse.description}
                        onChange={handleInputChange}
                        placeholder="Enter course description"
                      />
                    </section>
                  ) : (
                    <section className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">
                        Course Overview
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {course.description}
                      </p>
                    </section>
                  )}
    
                  <section className="space-y-6">
                    <h3 className="text-3xl font-bold text-gray-800">Curriculum</h3>
                    <div className="space-y-4">
                      {course?.curriculum?.map((module, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <span className="text-orange-600 font-bold">
                                {idx + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="sectionTitle"
                                  value={
                                    updatedCourse.curriculum?.[idx]?.sectionTitle ||
                                    ""
                                  }
                                  onChange={(e) => {
                                    setUpdatedCourse((prev) => {
                                      const newCurriculum = prev.curriculum
                                        ? [...prev.curriculum]
                                        : [];
                                      if (!newCurriculum[idx]) {
                                        newCurriculum[idx] = {};
                                      }
                                      newCurriculum[idx] = {
                                        ...newCurriculum[idx],
                                        sectionTitle: e.target.value,
                                      };
                                      return { ...prev, curriculum: newCurriculum };
                                    });
                                  }}
                                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                />
                              ) : (
                                <h4 className="text-xl font-semibold text-gray-800">
                                  {module.sectionTitle}
                                </h4>
                              )}
    
                              <ul className="mt-2 space-y-2">
                                {module.lessons?.map((lecture, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                                  >
                                    {isEditing ? (
                                      <>
                                        <input
                                          type="text"
                                          value={
                                            updatedCourse.curriculum?.[idx]
                                              ?.lessons?.[i]?.title || ""
                                          }
                                          onChange={(e) => {
                                            setUpdatedCourse((prev) => {
                                              const newCurriculum = prev.curriculum
                                                ? [...prev.curriculum]
                                                : [];
                                              if (!newCurriculum[idx])
                                                newCurriculum[idx] = {
                                                  lessons: [],
                                                };
                                              if (!newCurriculum[idx].lessons)
                                                newCurriculum[idx].lessons = [];
                                              if (!newCurriculum[idx].lessons[i])
                                                newCurriculum[idx].lessons[i] = {};
    
                                              newCurriculum[idx].lessons[i] = {
                                                ...newCurriculum[idx].lessons[i],
                                                title: e.target.value,
                                              };
    
                                              return { ...prev, curriculum: newCurriculum };
                                            });
                                          }}
                                          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                        />
                                        <input
                                          type="text"
                                          value={
                                            updatedCourse.curriculum?.[idx]
                                              ?.lessons?.[i]?.duration || ""
                                          }
                                          onChange={(e) => {
                                            setUpdatedCourse((prev) => {
                                              const newCurriculum = prev.curriculum
                                                ? [...prev.curriculum]
                                                : [];
    
                                              if (!newCurriculum[idx])
                                                newCurriculum[idx] = {
                                                  lessons: [],
                                                };
                                              if (!newCurriculum[idx].lessons)
                                                newCurriculum[idx].lessons = [];
                                              if (!newCurriculum[idx].lessons[i])
                                                newCurriculum[idx].lessons[i] = {};
    
                                              newCurriculum[idx].lessons[i] = {
                                                ...newCurriculum[idx].lessons[i],
                                                duration: e.target.value,
                                              };
    
                                              return { ...prev, curriculum: newCurriculum };
                                            });
                                          }}
                                          className="w-20 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-gray-600">
                                          {lecture.title}
                                        </span>
                                        <span className="text-sm text-orange-600">
                                          {lecture.duration}
                                        </span>
                                      </>
                                    )}
                                  </li>
                                ))}
                              </ul>
                              {module.quiz && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <div className="flex items-center text-orange-600">
                                    {isEditing ? (
                                      <input
                                        type="text"
                                        value={
                                          updatedCourse.curriculum?.[idx]?.quiz ||
                                          ""
                                        }
                                        onChange={(e) => {
                                          setUpdatedCourse((prev) => ({
                                            ...prev,
                                            curriculum: prev.curriculum?.map(
                                              (module, modIdx) =>
                                                modIdx === idx
                                                  ? {
                                                      ...module,
                                                      quiz: e.target.value,
                                                    }
                                                  : module
                                            ) || [],
                                          }));
                                        }}
                                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                                      />
                                    ) : (
                                      <span className="text-gray-600">
                                        {module.quiz}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
    
                {/* Right Column: Feedback Form */}
                <div className="lg:col-span-1">
                  <form
                    onSubmit={handleFeedbackSubmit}
                    className="space-y-4 bg-white p-6 rounded-xl shadow-sm"
                  >
                    <h3 className="text-base sm:text-xl font-bold">
                      Leave Your Feedback
                    </h3>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() =>
                            setFeedback({ ...feedback, rating: star })
                          }
                          className={`w-6 h-6 sm:w-8 sm:h-8 ${
                            feedback.rating >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={feedback.comment}
                      onChange={(e) =>
                        setFeedback({ ...feedback, comment: e.target.value })
                      }
                      placeholder="Write your feedback..."
                      className="w-full p-2 border rounded-lg text-xs sm:text-sm"
                      required
                    ></textarea>
                    <button
                      type="submit"
                      className="text-orange-500 hover:text-white border border-orange-500 transition-colors py-2 px-4 rounded-lg hover:bg-orange-500 text-xs sm:text-sm"
                    >
                      Submit Feedback
                    </button>
                    {isRoleAdmin === "admin" && (
                      <>
                        {!isEditing ? (
                          <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-500 text-xs sm:text-sm"
                          >
                            Edit Course
                          </button>
                        ) : (
                          <button
                            type="submit"
                            onClick={(e) => {
                              setIsEditing(false);
                              handleUpdate(e);
                            }}
                            className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-500 text-xs sm:text-sm"
                          >
                            Update
                          </button>
                        )}
                      </>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      <Footer />
    </>
  );
  };

export default CourseDetailsPage;
