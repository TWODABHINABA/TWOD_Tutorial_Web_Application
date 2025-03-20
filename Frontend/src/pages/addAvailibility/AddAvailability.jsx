import { useState, useEffect } from "react";
import api from "../../components/User-management/api";
import { useNavigate } from "react-router-dom";

const AddAvailability = () => {
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
  // useEffect(() => {
  //   const fetchTutors = async () => {
  //     try {
  //       const response = await api.get("/tutors");
  //       setTutors(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch tutors");
  //     }
  //   };
  //   fetchTutors();
  // }, []);
  // useEffect(() => {
  //   const fetchAvailability = async () => {
  //     if (!selectedTutor) return;
  //     try {
  //       const response = await api.get(`/tutors/${selectedTutor}/availability`
  //       );
  //       setAvailability(response.data || []);
  //     } catch (error) {
  //       console.error("Failed to fetch availability", error);
  //     }
  //   };
  //   fetchAvailability();
  // }, [selectedTutor]);

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
          // Ensure availability with time slots only
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

  // const handleAddDate = () => {
  //   if (
  //     selectedDate &&
  //     !newAvailableDates.some((d) => d.date === selectedDate)
  //   ) {
  //     setNewAvailableDates([
  //       ...newAvailableDates,
  //       { date: selectedDate, timeSlots: [] },
  //     ]);
  //     setSelectedDate("");
  //   }
  // };

  // const handleRemoveDate = (date) => {
  //   setNewAvailableDates(newAvailableDates.filter((d) => d.date !== date));
  // };

  const handleAddDate = () => {
    if (!selectedDate) return; // Ensure a date is selected

    setNewAvailableDates((prevDates) => {
      if (prevDates.some((d) => d.date === selectedDate)) return prevDates; // Prevent duplicates
      return [...prevDates, { date: selectedDate, timeSlots: [] }];
    });

    setSelectedDate(""); // Reset input after adding
  };

  const handleRemoveDate = (date) => {
    setNewAvailableDates((prevDates) =>
      prevDates.filter((d) => d.date !== date)
    );
  };

  // const handleAddTimeSlotToDate = (date) => {
  //   if (timeSlot) {
  //     setNewAvailableDates(
  //       newAvailableDates.map((d) =>
  //         d.date === date && !d.timeSlots.includes(timeSlot)
  //           ? { ...d, timeSlots: [...d.timeSlots, timeSlot] }
  //           : d
  //       )
  //     );
  //     setTimeSlot("");
  //   }
  // };

  // const handleRemoveTimeSlotFromDate = (date, slot) => {
  //   setNewAvailableDates(
  //     newAvailableDates.map((d) =>
  //       d.date === date
  //         ? { ...d, timeSlots: d.timeSlots.filter((s) => s !== slot) }
  //         : d
  //     )
  //   );
  // };

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
              startTime: "", // Reset start time input
              endTime: "", // Reset end time input
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

  // const handleDeleteDate = async (date) => {
  //   console.log("Deleting date:", date, "for tutor:", selectedTutor);

  //   // Ensure the date format matches the stored format in MongoDB
  //   const formattedDate = date; // Your database already stores "YYYY-MM-DD"

  //   try {
  //     const response = await api.delete(`/tutors/${selectedTutor}/availability/date/${formattedDate}`
  //     );

  //     if (response.status === 200) {
  //       setAvailability(availability.filter((d) => d.date !== date));
  //       console.log("Date deleted successfully");
  //     } else {
  //       console.error("Unexpected response:", response);
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error deleting date:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

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
        // Immediately update the state to remove the deleted date
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

  // Delete a specific time slot
  // const handleDeleteTimeSlot = async (date, time) => {
  //   console.log(
  //     "Deleting time slot:",
  //     time,
  //     "on date:",
  //     date,
  //     "for tutor:",
  //     selectedTutor
  //   );

  //   try {
  //     const formattedTime = encodeURIComponent(time); // Ensure URL encoding for space (%20)
  //     console.log("Formatted time being sent:", formattedTime);

  //     const response = await api.delete(`/tutors/${selectedTutor}/availability/date/${date}/time/${formattedTime}`
  //     );

  //     if (response.status === 200) {
  //       setAvailability((prev) =>
  //         prev.map((d) =>
  //           d.date === date
  //             ? { ...d, timeSlots: d.timeSlots.filter((t) => t !== time) }
  //             : d
  //         )
  //       );
  //       console.log("Time slot deleted successfully");
  //     } else {
  //       console.error("Unexpected response:", response);
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error deleting time slot:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  const handleDeleteTimeSlot = async (date, time) => {
    if (!selectedTutor) {
      console.error("No tutor selected. Cannot delete time slot.");
      return;
    }

    // Assuming time is an object, compare using a unique field (e.g., time._id or time.time)
    const timeSlotIdentifier = time._id || time; // Use the unique identifier for comparison
    console.log(
      `🕒 Deleting time slot: ${timeSlotIdentifier} on date: ${date} for tutor: ${selectedTutor}`
    );

    try {
      const formattedTime = encodeURIComponent(timeSlotIdentifier); // Ensure URL encoding for special characters
      console.log(
        `🚀 Sending API request to delete time slot: ${formattedTime}`
      );

      const response = await api.delete(
        `/tutors/${selectedTutor}/availability/date/${date}/time/${formattedTime}`
      );

      if (response.status === 200) {
        // Update the availability state by filtering out the deleted time slot
        setAvailability((prevAvailability) =>
          prevAvailability.map((d) =>
            d.date === date
              ? {
                  ...d,
                  timeSlots: d.timeSlots.filter(
                    (t) => t._id !== timeSlotIdentifier // Ensure comparison by _id
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

  // const handleSetAvailability = async () => {
  //   const requestData = {
  //     availability: newAvailableDates.map((item) => ({
  //       date: item.date,
  //       timeSlots: item.timeSlots,
  //     })),
  //   };

  //   console.log(
  //     "📤 Sending API Request:",
  //     JSON.stringify(requestData, null, 2)
  //   );

  //   try {
  //     const response = await api.post(`/tutors/${selectedTutor}/availability`,
  //       requestData
  //     );
  //     console.log("✅ Response:", response.data);
  //     setMessage(response.data.message);
  //     setMessageType("success");
  //     navigate("/");
  //   } catch (error) {
  //     console.error(
  //       "❌ Error setting availability:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

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
      {!isDelete ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 shadow-md rounded-lg w-96 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Set Availability</h2>
              <button
                className="text-red-500 text-xl"
                onClick={() => navigate("/add-tutor")}
              >
                ✕
              </button>
            </div>

            {/* Status Message */}
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
              {/* Select Tutor */}
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

              {/* Select Date */}
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

              {/* Display Dates & Time Slots */}
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

                    {/* Display Time Slots */}
                    {/* {dateObj.timeSlots.map((slot, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 p-1 m-1 rounded inline-block"
                      >
                        {slot.startTime} - {slot.endTime}{" "}
                        <button
                          className="text-red-500"
                          onClick={() =>
                            handleRemoveTimeSlotFromDate(dateObj.date, slot)
                          }
                        >
                          ✕
                        </button>
                      </span>
                    ))} */}
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

                    {/* Add Time Slot with Start and End Time */}
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

            {/* Buttons */}
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
        </div>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-6 shadow-md rounded-lg w-96 max-h-[80vh] flex flex-col overflow-y-auto">
            <h2 className="text-2xl font-bold">Delete Availability</h2>

            {/* Select Tutor */}
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

            {/* Show Availability */}
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
        </div>
      )}
    </>
  );
};
export default AddAvailability;
