import { useState, useEffect } from "react";
import api from "../../components/User-management/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import SidebarMobile from "./SidebarMobile";
import { Toast } from "flowbite-react";

const TutorAddAvailability = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(""); // ✅ NEW: Store subject
  const [selectedDate, setSelectedDate] = useState("");
  const [availability, setAvailability] = useState([]);
  const [newAvailableDates, setNewAvailableDates] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loggedInTutorId, setLoggedInTutorId] = useState(null);
  const [filteredAvailability, setFilteredAvailability] = useState([]);

  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role !== "tutor" && role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);

  useEffect(() => {
    if (selectedSubject) {
      // Filter availability based on selected subject
      const filtered = availability.filter((dateObj) =>
        dateObj.subjects.some((subj) => subj.subjectName === selectedSubject)
      );
      setFilteredAvailability(filtered);
    } else {
      setFilteredAvailability([]); // Reset if no subject is selected
    }
  }, [selectedSubject, availability]);

  useEffect(() => {
    const fetchTutorSubjects = async () => {
      try {
        const token = localStorage.getItem("token"); // Get JWT token

        const response = await api.get("/tutors/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tutorData = response.data;
        setSubjects(tutorData.subjects || []); // ✅ Store only the tutor's subjects
      } catch (error) {
        console.error("Error fetching tutor subjects:", error);
      }
    };

    fetchTutorSubjects();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // ✅ Decode JWT
        setLoggedInTutorId(decodedToken.id); // ✅ Extract Tutor ID
        console.log("Logged-in Tutor ID:", decodedToken.id);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!loggedInTutorId) return; // ✅ Ensure tutor ID exists before making API call

    const fetchData = async () => {
      try {
        console.log(
          "Fetching availability for logged-in tutor:",
          loggedInTutorId
        );

        // Include subject filter if needed
        const queryParam = selectedSubject ? `?subject=${selectedSubject}` : "";
        const availabilityResponse = await api.get(
          `/tutors/availability${queryParam}`
        );

        console.log("📤 Received Availability:", availabilityResponse.data);

        const filteredAvailability = availabilityResponse.data.availability.map(
          (entry) => ({
            date: entry.date,
            subjects:
              entry.subjects.length > 0
                ? entry.subjects
                : [{ subjectName: "General" }], // ✅ Ensure subjects array exists
          })
        );

        setAvailability(filteredAvailability);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, [loggedInTutorId, selectedSubject]); // ✅ Re-fetch when subject changes (if filtering is needed)

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleAddDate = () => {
    if (!selectedDate || !selectedSubject) return; // ✅ Ensure both date & subject are selected

    setNewAvailableDates((prevDates) => {
      const exists = prevDates.some(
        (d) => d.date === selectedDate && d.subject === selectedSubject
      );

      if (exists) return prevDates; // ✅ Prevent duplicate entries

      return [
        ...prevDates,
        { date: selectedDate, subject: selectedSubject, timeSlots: [] }, // ✅ Initialize time slots
      ];
    });

    setSelectedDate(""); // ✅ Reset date selection after adding
  };

  const handleRemoveDate = (date, subject) => {
    setNewAvailableDates((prevDates) =>
      prevDates.filter((d) => !(d.date === date && d.subject === subject))
    );
  };

  const handleAddTimeSlotToDate = (date, subject, startTime, endTime) => {
    if (!startTime || !endTime) return;

    setNewAvailableDates((prevDates) =>
      prevDates.map((d) => {
        if (d.date === date && d.subject === subject) {
          const newSlot = { startTime, endTime };
          const exists = d.timeSlots.some(
            (slot) => slot.startTime === startTime && slot.endTime === endTime
          );

          if (exists) return d; // Avoid duplicates

          return {
            ...d,
            timeSlots: [...(d.timeSlots || []), newSlot],
          };
        }
        return d;
      })
    );

    // ✅ Reset start and end time after adding
    setStartTime("");
    setEndTime("");
  };

  const handleRemoveTimeSlotFromDate = (date, subject, slotToRemove) => {
    setNewAvailableDates((prevDates) =>
      prevDates.map((d) =>
        d.date === date && d.subject === subject
          ? {
              ...d,
              timeSlots: d.timeSlots.filter(
                (slot) =>
                  slot.startTime !== slotToRemove.startTime ||
                  slot.endTime !== slotToRemove.endTime
              ), // ✅ Ensure removal matches both start & end time
            }
          : d
      )
    );
  };

  const handleDeleteDate = async (date, subject) => {
    if (!loggedInTutorId) {
      console.error("❌ No logged-in tutor. Cannot delete availability.");
      return;
    }

    if (!subject) {
      console.error("❌ Subject is required to delete availability.");
      return;
    }

    // Convert date to string format "YYYY-MM-DD" (to match backend expectations)
    const formattedDate = new Date(date).toISOString().split("T")[0];

    try {
      console.log("🗑️ Deleting availability:", {
        date: formattedDate,
        subject,
        tutorId: loggedInTutorId,
      });

      // Send DELETE request to backend
      const response = await api.delete(
        `/tutors/availability/date/${formattedDate}?subject=${encodeURIComponent(
          subject
        )}&tutorId=${loggedInTutorId}`
      );

      console.log("📥 API Response After Deletion:", response.data);

      if (response.status === 200) {
        // ✅ Ensure state update matches the exact date format stored in MongoDB
        setAvailability(
          (prevAvailability) =>
            prevAvailability
              .map((entry) => ({
                ...entry,
                date: new Date(entry.date).toISOString().split("T")[0], // Normalize all dates
              }))
              .filter((entry) => entry.date !== formattedDate) // Filter out the deleted date
        );

        console.log("✅ Availability deleted successfully");
      }
    } catch (error) {
      console.error(
        "❌ Error deleting availability:",
        error.response?.status,
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteTimeSlot = async (date, subject, timeSlot) => {
    if (!loggedInTutorId) {
      console.error("No logged-in tutor. Cannot delete time slot.");
      return;
    }

    const formattedDate = encodeURIComponent(date);
    const formattedTime = encodeURIComponent(timeSlot.startTime); // Use startTime for deletion reference

    console.log(
      `🕒 Deleting time slot: ${timeSlot.startTime} - ${timeSlot.endTime} on date: ${date} (Subject: ${subject}) for tutor: ${loggedInTutorId}`
    );

    try {
      const response = await api.delete(
        `/tutors/availability/date/${formattedDate}/time/${formattedTime}?subject=${encodeURIComponent(
          subject
        )}&tutorId=${loggedInTutorId}`
      );

      if (response.status === 200) {
        setAvailability(
          (prevAvailability) =>
            prevAvailability
              .map((entry) => {
                if (entry.date === date) {
                  return {
                    ...entry,
                    subjects: entry.subjects
                      .map((sub) => {
                        if (sub.subjectName === subject) {
                          return {
                            ...sub,
                            timeSlots: sub.timeSlots.filter(
                              (slot) => slot.startTime !== timeSlot.startTime
                            ),
                          };
                        }
                        return sub;
                      })
                      .filter((sub) => sub.timeSlots.length > 0), // Remove subjects without time slots
                  };
                }
                return entry;
              })
              .filter((entry) => entry.subjects.length > 0) // Remove dates without subjects
        );

        console.log("✅ Time slot deleted successfully");
      } else {
        console.error(
          `⚠️ Unexpected response: ${response.status}`,
          response.data
        );
      }
    } catch (error) {
      console.error(
        `❌ Error deleting time slot: ${
          error.response?.status || "Unknown Status"
        }`,
        error.response?.data || error.message
      );
    }
  };

  const handleSetAvailability = async () => {
    if (!selectedSubject) {
      alert("Please select a subject.");
      return;
    }

    if (newAvailableDates.length === 0) {
      alert("Please add at least one date.");
      return;
    }

    const requestData = {
      availability: newAvailableDates.map((item) => ({
        date: new Date(item.date).toISOString().split("T")[0], // Ensuring correct date format
        subject: item.subject,
        timeSlots: item.timeSlots.map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      })),
    };

    console.log(
      "📤 Sending API Request:",
      JSON.stringify(requestData, null, 2)
    );

    try {
      const response = await api.post("/tutors/availability", requestData);
      console.log("✅ Response:", response.data);
      // setMessage(response.data.message);
      setToast({
        show: true,
        message: "set availability successful",
        type: "success",
      });
      // setMessageType("success");
    } catch (error) {
      setToast({
        show: true,
        message:
          error.response?.data?.message ||
          "Email and Password Sent Successful!",
        type: "success",
      });

      if (error.response?.data?.error) {
        alert(`⚠️ ${error.response.data.error}`);
      }
    }
  };

  return (
    <>
      <div className="flex bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <div className="absolute md:static top-0 left-0 z-50">
          <div className="max-md:hidden">
            <Sidebar />
          </div>
          <div className="md:hidden">
            <SidebarMobile />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full z-0 relative">
          <Navbar title="Set Availability" />

          {toast.show && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ show: false })}
            />
          )}

          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 shadow-md rounded-lg w-96 max-h-[80vh] flex flex-col">
              <h2>Selected Subject {selectedSubject}</h2>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Set Availability</h2>
                <button
                  className="text-red-500 text-xl"
                  onClick={() => navigate("/")}
                >
                  ✕
                </button>
              </div>

              {message && (
                <p
                  className={`text-${
                    messageType === "error" ? "red" : "green"
                  }-500 mb-2`}
                >
                  {message}
                </p>
              )}

              <div className="overflow-y-auto max-h-[60vh] mt-2 px-1">
                <div className="mb-4">
                  <div className="flex gap-2">
                    <div>
                      <label className="block font-semibold">
                        Select Subject
                      </label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject, index) => (
                          <option key={index} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {selectedSubject && filteredAvailability.length > 0 ? (
                    <div className="mt-2 overflow-y-auto max-h-40 border rounded p-2">
                      {filteredAvailability.map((dateObj) => (
                        <div
                          key={dateObj.date}
                          className="border p-2 rounded mt-2"
                        >
                          <div className="flex justify-between">
                            <h3 className="font-semibold">
                              {new Date(dateObj.date).toLocaleDateString()}
                            </h3>
                            <button
                              className="text-red-500"
                              onClick={() =>
                                handleDeleteDate(dateObj.date, selectedSubject)
                              }
                            >
                              ✕
                            </button>
                          </div>

                          {dateObj.subjects
                            .find(
                              (subj) => subj.subjectName === selectedSubject
                            )
                            ?.timeSlots.map((slot, index) => (
                              <div
                                key={slot._id || `slot-${index}`}
                                className="bg-gray-200 p-1 m-1 rounded inline-block"
                              >
                                {slot.startTime} - {slot.endTime}
                                <button
                                  className="text-red-500 ml-2"
                                  onClick={() =>
                                    handleDeleteTimeSlot(
                                      dateObj.date,
                                      selectedSubject,
                                      slot
                                    )
                                  }
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center mt-4">
                      {selectedSubject
                        ? "No availability for this subject."
                        : "Select a subject to see availability."}
                    </p>
                  )}
                  <label className="block font-semibold">Select Date</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      onChange={(e) => setSelectedDate(e.target.value)}
                      value={selectedDate}
                    />
                    <button
                      className="bg-gray-500 text-white p-2 rounded disabled:opacity-50"
                      onClick={handleAddDate}
                      disabled={
                        !selectedDate ||
                        newAvailableDates.some((d) => d.date === selectedDate)
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>

                {newAvailableDates.length > 0 ? (
                  newAvailableDates.map((dateObj, index) => (
                    <div key={index} className="mb-4 border p-2 rounded">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{dateObj.date}</h3>
                        <button
                          className="text-red-500 p-1"
                          onClick={() =>
                            handleRemoveDate(dateObj.date, dateObj.subject)
                          }
                        >
                          ❌
                        </button>
                      </div>

                      {dateObj.timeSlots.length > 0 ? (
                        dateObj.timeSlots.map((slot, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-200 p-1 m-1 rounded inline-block"
                          >
                            {slot.startTime} - {slot.endTime}
                            <button
                              className="text-red-500 p-1"
                              onClick={() =>
                                handleRemoveTimeSlotFromDate(
                                  dateObj.date,
                                  dateObj.subject,
                                  slot
                                )
                              }
                            >
                              ❌
                            </button>
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          No time slots added yet.
                        </p>
                      )}

                      <div className="flex gap-2 mt-2">
                        <input
                          type="time"
                          className="p-2 border rounded w-full"
                          placeholder="Start Time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                        <input
                          type="time"
                          className="p-2 border rounded w-full"
                          placeholder="End Time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                        <button
                          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
                          onClick={() =>
                            handleAddTimeSlotToDate(
                              dateObj.date,
                              selectedSubject,
                              startTime,
                              endTime
                            )
                          }
                          disabled={!startTime || !endTime}
                        >
                          Add Time
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    No availability added yet.
                  </p>
                )}
              </div>

              <button
                className="bg-green-500 text-white p-2 rounded w-full mt-4 disabled:opacity-50"
                onClick={handleSetAvailability}
                disabled={newAvailableDates.length === 0}
              >
                Set Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorAddAvailability;
