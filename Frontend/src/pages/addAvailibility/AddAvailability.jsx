import { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import api from "../../components/User-management/api";
import { useNavigate } from "react-router-dom";

const AddAvailability = () => {
  // const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  // const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [newAvailableDates, setNewAvailableDates] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await api.get("/tutors");
        setTutors(response.data);
      } catch (error) {
        console.error("Failed to fetch tutors");
      }
    };
    fetchTutors();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleAddDate = () => {
    if (
      selectedDate &&
      !newAvailableDates.some((d) => d.date === selectedDate)
    ) {
      setNewAvailableDates([
        ...newAvailableDates,
        { date: selectedDate, timeSlots: [] },
      ]);
      setSelectedDate("");
    }
  };

  const handleRemoveDate = (date) => {
    setNewAvailableDates(newAvailableDates.filter((d) => d.date !== date));
  };

  const handleAddTimeSlotToDate = (date) => {
    if (timeSlot) {
      setNewAvailableDates(
        newAvailableDates.map((d) =>
          d.date === date && !d.timeSlots.includes(timeSlot)
            ? { ...d, timeSlots: [...d.timeSlots, timeSlot] }
            : d
        )
      );
      setTimeSlot("");
    }
  };

  const handleRemoveTimeSlotFromDate = (date, slot) => {
    setNewAvailableDates(
      newAvailableDates.map((d) =>
        d.date === date
          ? { ...d, timeSlots: d.timeSlots.filter((s) => s !== slot) }
          : d
      )
    );
  };

  const handleSetAvailability = async () => {
    const requestData = {
      availability: newAvailableDates.map((item) => ({
        date: item.date,
        timeSlots: item.timeSlots,
      })),
    };

    console.log(
      "📤 Sending API Request:",
      JSON.stringify(requestData, null, 2)
    );

    try {
      const response = await axios.post(
        `http://localhost:6001/tutors/${selectedTutor}/availability`,
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
      {/* <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Set Availability</h2>
          {message && (
            <p
              className={`text-${
                messageType === "error" ? "red" : "green"
              }-500`}
            >
              {message}
            </p>
          )}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600"
            onClick={() => setShowPopup(false)}
          >
            Close
          </button>

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
                className="bg-gray-500 text-white p-2 rounded"
                onClick={handleAddDate}
              >
                Add
              </button>
            </div>
          </div>

          {newAvailableDates.map((dateObj, index) => (
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
              {dateObj.timeSlots.map((slot, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 p-1 m-1 rounded inline-block"
                >
                  {slot}{" "}
                  <button
                    className="text-red-500"
                    onClick={() =>
                      handleRemoveTimeSlotFromDate(dateObj.date, slot)
                    }
                  >
                    ✕
                  </button>
                </span>
              ))}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  placeholder="Add time slot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => handleAddTimeSlotToDate(dateObj.date)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}

          <button
            className="bg-green-500 text-white p-2 rounded w-full"
            onClick={handleSetAvailability}
          >
            Set Availability
          </button>
        </div> */}

      {/* <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 shadow-md rounded-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Set Availability</h2>

          {message && (
            <p
              className={`text-${
                messageType === "error" ? "red" : "green"
              }-500 mb-2`}
            >
              {message}
            </p>
          )}

          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600"
            onClick={() => navigate("/add-tutor")}
          >
            Close
          </button>

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
                className="bg-gray-500 text-white p-2 rounded"
                onClick={handleAddDate}
              >
                Add
              </button>
            </div>
          </div>

          {newAvailableDates.map((dateObj, index) => (
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
              {dateObj.timeSlots.map((slot, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 p-1 m-1 rounded inline-block"
                >
                  {slot}{" "}
                  <button
                    className="text-red-500"
                    onClick={() =>
                      handleRemoveTimeSlotFromDate(dateObj.date, slot)
                    }
                  >
                    ✕
                  </button>
                </span>
              ))}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  placeholder="Add time slot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => handleAddTimeSlotToDate(dateObj.date)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}

          <button
            className="bg-green-500 text-white p-2 rounded w-full mt-4"
            onClick={handleSetAvailability}
          >
            Set Availability
          </button>
        </div>
      </div> */}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
     
        <div className="bg-white p-6 shadow-md rounded-lg w-96 max-h-[80vh] flex flex-col">
        
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Set Availability</h2>
            <button
              className="text-red-500 text-xl"
              onClick={() => navigate("/add-tutor")}
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
                  className="bg-gray-500 text-white p-2 rounded"
                  onClick={handleAddDate}
                >
                  Add
                </button>
              </div>
            </div>

            {newAvailableDates.map((dateObj, index) => (
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
                {dateObj.timeSlots.map((slot, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 p-1 m-1 rounded inline-block"
                  >
                    {slot}{" "}
                    <button
                      className="text-red-500"
                      onClick={() =>
                        handleRemoveTimeSlotFromDate(dateObj.date, slot)
                      }
                    >
                      ✕
                    </button>
                  </span>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    className="p-2 border rounded w-full"
                    placeholder="Add time slot"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 text-white p-2 rounded"
                    onClick={() => handleAddTimeSlotToDate(dateObj.date)}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="bg-green-500 text-white p-2 rounded w-full mt-4"
            onClick={handleSetAvailability}
          >
            Set Availability
          </button>
        </div>
      </div>
    </>
  );
};
export default AddAvailability;
