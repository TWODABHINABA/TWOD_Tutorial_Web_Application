import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../components/User-management/api";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EnrollmentCalendar from "./EnrollmentCalendar";
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

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
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("1 hr");
  const token = localStorage.getItem("token");
  console.log(courseId);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data);
        console.log(response.data);
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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      window.location.href("/register");
    }
    try {
      const response = await api.post(`/${courseId}/feedback`, feedback, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCourse(response.data.course);
      setFeedback({ rating: "", comment: "" });
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };


  const handleEnrollClick = async () => {
    try {
      const response = await api.get(`/courses/${courseId}/tutors`);
      setTutors(response.data);
      setShowEnrollModal(true);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  };

  const handleTutorSelection = async (tutorId) => {
    setSelectedTutor(tutorId);
    setSelectedDate("");
    setAvailableDates([]);
    setSelectedTimeSlot("");
    setAvailableTimeSlots([]);

    try {
      const response = await api.get(`/tutors/${tutorId}/available-dates`);
      setAvailableDates(response.data);
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
  };

  const handleDateSelection = async (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot("");
    setAvailableTimeSlots([]);

    try {
      const response = await api.get(`/tutors/${selectedTutor}/available-slots?date=${date}`);
      setAvailableTimeSlots(response.data);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const handleEnrollNow = async () => {
    if (!selectedTutor || !selectedDate || !selectedTimeSlot || !selectedDuration) {
      alert("Please select all options before enrolling.");
      return;
    }

    try {
      const response = await api.post(
        `/${course._id}/enroll`,
        { 
          tutorId: selectedTutor, 
          date: selectedDate, 
          timeSlot: selectedTimeSlot, 
          duration: selectedDuration,
          price: course.discountPrice || course.price 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { approval_url } = response.data;
      if (approval_url) {
        window.location.href = approval_url;
      } else {
        alert("Error: No approval URL received.");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("Enrollment failed. Try again later.");
    }
  };
  // const handleEnrollClick = async () => {
  //   try {
  //     const response = await api.get(`/courses/${courseId}/tutors`);
  //     setTutors(response.data);
  //     setShowTutorModal(true);
  //   } catch (error) {
  //     console.error("Error fetching tutors:", error);
  //   }
  // };

  // const handleEnrollNow = async () => {
  //   // const token = localStorage.getItem("token");
  //   // if (!token) {
  //   //   window.location.href = "/register";
  //   //   return;
  //   // }

  //   try {
  //     // POST to the enrollment endpoint using the course's _id
  //     const response = await api.post(
  //       `/${course._id}/enroll`,
  //       { price: course.discountPrice || course.price },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const { approval_url } = response.data;
  //     if (approval_url) {
  //       // Redirect the user to PayPal for payment approval
  //       window.location.href = approval_url;
  //     } else {
  //       alert("Error: No approval URL received from payment gateway.");
  //     }
  //   } catch (error) {
  //     console.error("Error enrolling and redirecting to PayPal:", error);
  //     alert("Enrollment failed. Please try again later.");
  //   }
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
          <p className="text-gray-600">No details available for {courseName}</p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 font-sans animate-fade-in">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <header className="mb-12">
          <div className="space-y-4">
            <Link
              to={`/category/${encodeURIComponent(course.category)}`}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-1"
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
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {course.name}
            </h1>
            <h2 className="text-xl text-gray-600 font-medium">
              {course.overview}
            </h2>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Course Overview
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </section>

            <section className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-800">Curriculum</h3>
              <div className="space-y-4">
                {course.curriculum?.map((module, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="text-indigo-600 font-bold">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-800">
                          {module.sectionTitle}
                        </h4>
                        <ul className="mt-2 space-y-2">
                          {module.lessons?.map((lecture, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                            >
                              <span className="text-gray-600">
                                {lecture.title}
                              </span>
                              <span className="text-sm text-indigo-600">
                                {lecture.duration}
                              </span>
                            </li>
                          ))}
                        </ul>
                        {module.quiz && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center text-indigo-600">
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                />
                              </svg>
                              <span className="font-medium">{module.quiz}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {course.feedbacks && (
              <section className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-800">
                  Student Feedback
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {course.feedbacks.map((feedback, i) => (
                    <div
                      key={i}
                      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={`http://localhost:6001${feedback.profilePicture}`}
                          alt="Profile"
                          className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center"
                        />

                        <div>
                          <p className="mt-3 font-medium text-gray-800">
                            {feedback.name}
                          </p>
                          <p className="text-gray-600 italic">
                            "{feedback.comment}"
                          </p>
                        </div>

                        <div className="flex items-center space-x-1 text-yellow-500">
                          {Array.from({ length: 5 }).map((_, index) => {
                            const fullStars = Math.floor(feedback.rating);
                            const hasHalfStar = feedback.rating % 1 !== 0;
                            if (index < fullStars) {
                              return <FaStar key={index} />;
                            } else if (index === fullStars && hasHalfStar) {
                              return <FaStarHalfAlt key={index} />;
                            } else {
                              return <FaRegStar key={index} />;
                            }
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8 ">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-4xl font-bold text-gray-800">
                    ${course.discountPrice}
                  </span>
                  {course.discountPrice && (
                    <p className="mt-1 text-sm text-red-600 line-through">
                      ${course.price}
                    </p>
                  )}
                </div>

                {!token ? (
                  <div></div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handleEnrollClick}
                      className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Enroll Now
                    </button>

                    <button
                      onClick={() => alert("Previewing course...")}
                      className="w-full py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors duration-200"
                    >
                      Preview Course
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {/* <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-600">{course.duration}</span>
                  </div> */}
                  {/* <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-gray-600">{course.instructor}</span>
                  </div> */}
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h3m0 0h3m-3 0v3m0-3V7m-3 10h3m0 0h3m-3 0v3m0-3v-3m-6 3l-3-3m0 0l-3 3m3-3V7"
                      />
                    </svg>
                    <span className="text-gray-600">{course.level}</span>
                  </div>
                </div>

                {showEnrollModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
      {/* Course Name at the Top */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Course Name
        </label>
        <input
          type="text"
          value={course.name}
          disabled
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>

      <div className="flex">
        {/* Left Column – Enrollment Options */}
        <div className="w-1/2 pr-4">
          <label className="block mb-2">Select Tutor:</label>
          <select
            className="w-full p-2 border rounded mb-4"
            onChange={(e) => handleTutorSelection(e.target.value)}
          >
            <option value="">No Preference (Auto-Select)</option>
            {tutors.map((tutor) => (
              <option key={tutor._id} value={tutor._id}>
                {tutor.name}
              </option>
            ))}
          </select>

          {availableTimeSlots.length > 0 && (
            <>
              <label className="block mb-2">Select Time Slot:</label>
              <select
                className="w-full p-2 border rounded mb-4"
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
              >
                <option value="">Choose a Time Slot</option>
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </>
          )}

          <label className="block mb-2">Select Duration:</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
          >
            <option value="30 mins">30 mins</option>
            <option value="1 hr">1 hr</option>
            <option value="2 hrs">2 hrs</option>
            <option value="3 hrs">3 hrs</option>
          </select>

          <button
            onClick={handleEnrollNow}
            className="w-full py-2 bg-green-500 text-white rounded mt-4"
          >
            Confirm &amp; Pay
          </button>
          <button
            onClick={() => setShowEnrollModal(false)}
            className="w-full py-2 mt-2 border border-gray-400 text-gray-600 rounded"
          >
            Cancel
          </button>
        </div>

        {/* Right Column – Big Calendar */}
        <div className="w-1/2 pl-4 border-l">
          <EnrollmentCalendar
            availableDates={availableDates}
            selectedDate={selectedDate}
            onChange={(dateString) => handleDateSelection(dateString)}
          />
        </div>
      </div>
    </div>
  </div>
)}
              </div>
            </div>

            <form
              onSubmit={handleFeedbackSubmit}
              className="space-y-4 bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-bold">Leave Your Feedback</h3>

              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFeedback({ ...feedback, rating: star })}
                    className={`w-8 h-8 ${
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
                className="w-full p-2 border rounded-lg"
                required
              ></textarea>

              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CourseDetailsPage;
