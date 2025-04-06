import { useState, useEffect } from "react";
import api from "../../components/User-management/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import SidebarMobile from "./SidebarMobile";

const TutorAddAvailability = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availability, setAvailability] = useState([]);
  const [newAvailableDates, setNewAvailableDates] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tutorResponse = await api.get("/tutors");
        setTutors(tutorResponse.data);

        if (selectedTutor) {
          console.log("Fetching availability for:", selectedTutor);
          const availabilityResponse = await api.get(
            `/tutors/${selectedTutor}/availability`
          );
          console.log("📤 Received Availability:", availabilityResponse.data);

          const filteredAvailability =
            availabilityResponse.data.availability.filter(
              (entry) => entry.timeSlots.length > 0
            );
          setAvailability(filteredAvailability);
        }
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, [selectedTutor]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleAddDate = () => {
    if (!selectedDate) return; 

    setNewAvailableDates((prevDates) => {
      if (prevDates.some((d) => d.date === selectedDate)) return prevDates;
      return [...prevDates, { date: selectedDate, timeSlots: [] }];
    });

    setSelectedDate(""); 
  };

  const handleRemoveDate = (date) => {
    setNewAvailableDates((prevDates) =>
      prevDates.filter((d) => d.date !== date)
    );
  };

  const handleAddTimeSlotToDate = (date) => {
    setNewAvailableDates((prevDates) =>
      prevDates.map((d) =>
        d.date === date
          ? {
              ...d,
              timeSlots: [
                ...d.timeSlots,
                { startTime: d.startTime, endTime: d.endTime },
              ],
              startTime: "",
              endTime: "",
            }
          : d
      )
    );
  };

  const handleRemoveTimeSlotFromDate = (date, slot) => {
    setNewAvailableDates((prevDates) =>
      prevDates.map((d) =>
        d.date === date
          ? { ...d, timeSlots: d.timeSlots.filter((s) => s !== slot) }
          : d
      )
    );
  };

  const handleDeleteDate = async (date) => {
    if (!selectedTutor) {
      console.error("No tutor selected. Cannot delete availability.");
      return;
    }

    console.log(`🗑️ Deleting date: ${date} for tutor: ${selectedTutor}`);

    try {
      const response = await api.delete(
        `/tutors/${selectedTutor}/availability/date/${date}`
      );

      if (response.status === 200) {
        setAvailability((prevAvailability) =>
          prevAvailability.filter((d) => d.date !== date)
        );
        console.log("✅ Date deleted successfully");
      } else {
        console.error(
          "⚠️ Unexpected response:",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error(
        "❌ Error deleting date:",
        error.response?.status,
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteTimeSlot = async (date, time) => {
    if (!selectedTutor) {
      console.error("No tutor selected. Cannot delete time slot.");
      return;
    }

    const timeSlotIdentifier = time._id || time;
    console.log(
      `🕒 Deleting time slot: ${timeSlotIdentifier} on date: ${date} for tutor: ${selectedTutor}`
    );

    try {
      const formattedTime = encodeURIComponent(timeSlotIdentifier); 
      console.log(
        `🚀 Sending API request to delete time slot: ${formattedTime}`
      );

      const response = await api.delete(
        `/tutors/${selectedTutor}/availability/date/${date}/time/${formattedTime}`
      );

      if (response.status === 200) {
        setAvailability((prevAvailability) =>
          prevAvailability.map((d) =>
            d.date === date
              ? {
                  ...d,
                  timeSlots: d.timeSlots.filter(
                    (t) => t._id !== timeSlotIdentifier 
                  ),
                }
              : d
          )
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
    const requestData = {
      availability: newAvailableDates.map((item) => ({
        date: item.date,
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
      const response = await api.post(
        `/tutors/${selectedTutor}/availability`,
        requestData
      );
      console.log("✅ Response:", response.data);
      setMessage(response.data.message);
      setMessageType("success");
      navigate("/");
    } catch (error) {
      console.error(
        "❌ Error setting availability:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <div className="flex bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <div className='absolute md:static top-0 left-0 z-50'>
        <div className='max-md:hidden'>
        <Sidebar />
        </div>
            <div className='md:hidden'>

        <SidebarMobile/>
            </div>
      </div>

        {/* Main Content */}
        <div className="w-full z-0 relative">
          <Navbar title="Set Availability" />

          {/* Inline Availability Form */}
          <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border">
            <div className="flex justify-start items-center mb-4">
              <h2 className="text-2xl font-bold">Set Availability</h2>
            </div>

            {message && (
              <p className={`text-${messageType === "error" ? "red" : "green"}-500 mb-2`}>
                {message}
              </p>
            )}

            <div className="overflow-y-auto max-h-[60vh] mt-2 px-1">
              <div className="mb-4">
                <label className="block font-semibold">Select Tutor</label>
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => setSelectedTutor(e.target.value)}
                  value={selectedTutor}
                >
                  <option value="">Select a tutor</option>
                  {tutors.map((tutor) => (
                    <option key={tutor._id} value={tutor._id}>
                      {tutor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
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
                        className="text-red-500"
                        onClick={() => handleRemoveDate(dateObj.date)}
                      >
                        ✕
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
                            className="text-red-500"
                            onClick={() =>
                              handleRemoveTimeSlotFromDate(dateObj.date, slot)
                            }
                          >
                            ✕
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No time slots added yet.</p>
                    )}

                    <div className="flex gap-2 mt-2">
                      <input
                        type="time"
                        className="p-2 border rounded w-full"
                        placeholder="Start Time"
                        value={dateObj.startTime || ""}
                        onChange={(e) =>
                          setNewAvailableDates((prev) =>
                            prev.map((d, idx) =>
                              idx === index
                                ? { ...d, startTime: e.target.value }
                                : d
                            )
                          )
                        }
                      />
                      <input
                        type="time"
                        className="p-2 border rounded w-full"
                        placeholder="End Time"
                        value={dateObj.endTime || ""}
                        onChange={(e) =>
                          setNewAvailableDates((prev) =>
                            prev.map((d, idx) =>
                              idx === index
                                ? { ...d, endTime: e.target.value }
                                : d
                            )
                          )
                        }
                      />
                      <button
                        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
                        onClick={() => handleAddTimeSlotToDate(dateObj.date)}
                        disabled={!dateObj.startTime || !dateObj.endTime}
                      >
                        Add
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
              disabled={!selectedTutor || newAvailableDates.length === 0}
            >
              Set Availability
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded w-full mt-4"
              onClick={() => setIsDelete(true)}
            >
              Delete Availability
            </button>
          </div>

          {/* Inline Delete Availability Section */}
          {isDelete && (
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border">
              <h2 className="text-2xl font-bold">Delete Availability</h2>
              <select
                className="w-full p-2 border rounded mt-2"
                onChange={(e) => setSelectedTutor(e.target.value)}
                value={selectedTutor}
              >
                <option value="">Select a tutor</option>
                {tutors.map((tutor) => (
                  <option key={tutor._id} value={tutor._id}>
                    {tutor.name}
                  </option>
                ))}
              </select>

              {availability.length > 0 ? (
                <div className="mt-2 overflow-y-auto max-h-40 border rounded p-2">
                  {availability.map((dateObj) => (
                    <div key={dateObj.date} className="border p-2 rounded mt-2">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">
                          {new Date(dateObj.date).toLocaleDateString()}
                        </h3>
                        <button
                          className="text-red-500"
                          onClick={() => handleDeleteDate(dateObj.date)}
                        >
                          ✕
                        </button>
                      </div>
                      {dateObj.timeSlots.map((slot) => (
                        <div
                          key={`${dateObj.date}-${slot.startTime}`}
                          className="bg-gray-200 p-1 m-1 rounded inline-block"
                        >
                          {slot.startTime} - {slot.endTime}{" "}
                          <button
                            className="text-red-500"
                            onClick={() =>
                              handleDeleteTimeSlot(dateObj.date, slot)
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
                  No availability data for selected tutor.
                </p>
              )}
              <button
                className="bg-blue-500 text-white p-2 rounded w-full mt-4"
                onClick={() => setIsDelete(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TutorAddAvailability;
