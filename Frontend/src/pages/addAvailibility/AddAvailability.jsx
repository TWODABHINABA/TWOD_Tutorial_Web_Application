import { useState, useEffect } from "react";
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
  const [availability, setAvailability] = useState([]);
  const [newAvailableDates, setNewAvailableDates] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [isDelete, setIsDelete] = useState(false);

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
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedTutor) return;
      try {
        const response = await api.get(`/tutors/${selectedTutor}/availability`
          // `https://twod-tutorial-web-application.onrender.com/tutors/${selectedTutor}/availability` 
          // `https://twod-tutorial-web-application.onrender.com/tutors/${selectedTutor}/availability` //vinay
          // `https://twod-tutorial-web-application-3brq.onrender.com/tutors/${selectedTutor}/availability`
        );
        setAvailability(response.data || []);
      } catch (error) {
        console.error("Failed to fetch availability", error);
      }
    };
    fetchAvailability();
  }, [selectedTutor]);

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
  const handleDeleteDate = async (date) => {
    console.log("Deleting date:", date, "for tutor:", selectedTutor);

    // Ensure the date format matches the stored format in MongoDB
    const formattedDate = date; // Your database already stores "YYYY-MM-DD" 

    try {
      const response = await api.delete(`/tutors/${selectedTutor}/availability/date/${formattedDate}`
        // `https://twod-tutorial-web-application.onrender.com/tutors/${selectedTutor}/availability/date/${formattedDate}` //vinay
        // `https://twod-tutorial-web-application-3brq.onrender.com/tutors/${selectedTutor}/availability/date/${formattedDate}`
      );

      if (response.status === 200) {
        setAvailability(availability.filter((d) => d.date !== date));
        console.log("Date deleted successfully");
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error(
        "Error deleting date:",
        error.response?.data || error.message
      );
    }
  };

  // Delete a specific time slot
  const handleDeleteTimeSlot = async (date, time) => {
    console.log(
      "Deleting time slot:",
      time,
      "on date:",
      date,
      "for tutor:",
      selectedTutor
    );

    try {
      const formattedTime = encodeURIComponent(time); // Ensure URL encoding for space (%20) 
      console.log("Formatted time being sent:", formattedTime);

      const response = await api.delete(`/tutors/${selectedTutor}/availability/date/${date}/time/${formattedTime}`
        // `https://twod-tutorial-web-application.onrender.com/tutors/${selectedTutor}/availability/date/${date}/time/${formattedTime}` //vinay
        // `https://twod-tutorial-web-application-3brq.onrender.com/tutors/${selectedTutor}/availability/date/${date}/time/${formattedTime}`
      );

      if (response.status === 200) {
        setAvailability((prev) =>
          prev.map((d) =>
            d.date === date
              ? { ...d, timeSlots: d.timeSlots.filter((t) => t !== time) }
              : d
          )
        );
        console.log("Time slot deleted successfully");
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error(
        "Error deleting time slot:",
        error.response?.data || error.message
      );
    }
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
      const response = await api.post(`/tutors/${selectedTutor}/availability`,
        // `https://twod-tutorial-web-application.onrender.com/tutors/${selectedTutor}/availability`,//vinay
         // `https://twod-tutorial-web-application-3brq.onrender.com/tutors/${selectedTutor}/availability`
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
      {!isDelete ?(
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
            <button
              className="bg-red-500 text-white p-2 rounded w-full mt-4"
              onClick={() => setIsDelete(true)}
            >
              Delete Availability
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 shadow-md rounded-lg w-96 max-h-[80vh] flex flex-col">
            <h2 className="text-2xl font-bold">Delete Availibility</h2>
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
       

     
            <div className="mt-2 overflow-y-auto max-h-40 border rounded p-2">
              {availability.map((dateObj) => (
                <div key={dateObj.date} className="border p-2 rounded mt-2">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{dateObj.date}</h3>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteDate(dateObj.date)}
                    >
                      ✕
                    </button>
                  </div>
                  {dateObj.timeSlots.map((slot) => (
                    <div
                      key={slot}
                      className="bg-gray-200 p-1 m-1 rounded inline-block"
                    >
                      {slot}{" "}
                      <button
                        className="text-red-500"
                        onClick={() => handleDeleteTimeSlot(dateObj.date, slot)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

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

// import { useState, useEffect } from "react";
// import axios from "axios";
// import api from "../../components/User-management/api";
// import { useNavigate } from "react-router-dom";

// const AddAvailability = () => {
//   const [tutors, setTutors] = useState([]);
//   const [selectedTutor, setSelectedTutor] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [newAvailableDates, setNewAvailableDates] = useState([]);
//   const [timeSlot, setTimeSlot] = useState("");
//   const [availability, setAvailability] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTutors = async () => {
//       try {
//         const response = await axios.get("https://twod-tutorial-web-application.onrender.com/tutors");
//         setTutors(response.data);
//       } catch (error) {
//         console.error("Failed to fetch tutors", error);
//       }
//     };
//     fetchTutors();
//   }, []);

//   // Fetch availability for selected tutor
//   useEffect(() => {
//     const fetchAvailability = async () => {
//       if (!selectedTutor) return;
//       try {
//         const response = await axios.get(
//           `https://twod-tutorial-web-application.onrender.com/tutors/${selectedTutor}/availability`
//         );
//         setAvailability(response.data || []);
//       } catch (error) {
//         console.error("Failed to fetch availability", error);
//       }
//     };
//     fetchAvailability();
//   }, [selectedTutor]);

//   // Add a new date
//   const handleAddDate = () => {
//     if (selectedDate && !newAvailableDates.some((d) => d.date === selectedDate)) {
//       setNewAvailableDates([
//         ...newAvailableDates,
//         { date: selectedDate, timeSlots: [] },
//       ]);
//       setSelectedDate("");
//     }
//   };

//   // Add time slot to a date
//   const handleAddTimeSlotToDate = (date) => {
//     if (timeSlot) {
//       setNewAvailableDates(
//         newAvailableDates.map((d) =>
//           d.date === date && !d.timeSlots.includes(timeSlot)
//             ? { ...d, timeSlots: [...d.timeSlots, timeSlot] }
//             : d
//         )
//       );
//       setTimeSlot("");
//     }
//   };

//   // Set availability for selected tutor
//   const handleSetAvailability = async () => {
//     const requestData = {
//       availability: newAvailableDates.map((item) => ({
//         date: item.date,
//         timeSlots: item.timeSlots,
//       })),
//     };
//     try {
//       await axios.post(
//         `https://twod-tutorial-web-application.onrender.com/tutors/${selectedTutor}/availability`,
//         requestData
//       );
//       navigate("/");
//     } catch (error) {
//       console.error("Error setting availability", error);
//     }
//   };

//   // Delete an entire date
//   const handleDeleteDate = async (date) => {
//     console.log("Deleting date:", date, "for tutor:", selectedTutor);

//     // Ensure the date format matches the stored format in MongoDB
//     const formattedDate = date; // Your database already stores "YYYY-MM-DD"

//     try {
//       const response = await axios.delete(
//         `https://twod-tutorial-web-application.onrender.com/tutors/${selectedTutor}/availability/date/${formattedDate}`
//       );

//       if (response.status === 200) {
//         setAvailability(availability.filter((d) => d.date !== date));
//         console.log("Date deleted successfully");
//       } else {
//         console.error("Unexpected response:", response);
//       }
//     } catch (error) {
//       console.error(
//         "Error deleting date:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   // Delete a specific time slot
//   const handleDeleteTimeSlot = async (date, time) => {
//     console.log("Deleting time slot:", time, "on date:", date, "for tutor:", selectedTutor);

//     try {
//       const formattedTime = encodeURIComponent(time); // Ensure URL encoding for space (%20)
//       console.log("Formatted time being sent:", formattedTime);

//       const response = await axios.delete(
//         `https://twod-tutorial-web-application.onrender.com/tutors/${selectedTutor}/availability/date/${date}/time/${formattedTime}`
//       );

//       if (response.status === 200) {
//         setAvailability((prev) =>
//           prev.map((d) =>
//             d.date === date
//               ? { ...d, timeSlots: d.timeSlots.filter((t) => t !== time) }
//               : d
//           )
//         );
//         console.log("Time slot deleted successfully");
//       } else {
//         console.error("Unexpected response:", response);
//       }
//     } catch (error) {
//       console.error(
//         "Error deleting time slot:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (

//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 shadow-md rounded-lg w-96 max-h-[80vh] flex flex-col">
//         <h2 className="text-2xl font-bold">Set Availability</h2>
//         <select
//           className="w-full p-2 border rounded"
//           onChange={(e) => setSelectedTutor(e.target.value)}
//           value={selectedTutor}
//         >
//           <option value="">Select a tutor</option>
//           {tutors.map((tutor) => (
//             <option key={tutor._id} value={tutor._id}>
//               {tutor.name}
//             </option>
//           ))}
//         </select>
//         <input
//           type="date"
//           className="w-full p-2 border rounded"
//           onChange={(e) => setSelectedDate(e.target.value)}
//           value={selectedDate}
//         />
//         <button
//           className="bg-gray-500 text-white p-2 rounded"
//           onClick={handleAddDate}
//         >
//           Add
//         </button>

//         {/* Scrollable availability section */}
//         <div className="mt-2 overflow-y-auto max-h-40 border rounded p-2">
//           {availability.map((dateObj) => (
//             <div key={dateObj.date} className="border p-2 rounded mt-2">
//               <div className="flex justify-between">
//                 <h3 className="font-semibold">{dateObj.date}</h3>
//                 <button
//                   className="text-red-500"
//                   onClick={() => handleDeleteDate(dateObj.date)}
//                 >
//                   ✕
//                 </button>
//               </div>
//               {dateObj.timeSlots.map((slot) => (
//                 <div
//                   key={slot}
//                   className="bg-gray-200 p-1 m-1 rounded inline-block"
//                 >
//                   {slot}{" "}
//                   <button
//                     className="text-red-500"
//                     onClick={() => handleDeleteTimeSlot(dateObj.date, slot)}
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         <button
//           className="bg-green-500 text-white p-2 rounded w-full mt-4"
//           onClick={handleSetAvailability}
//         >
//           Set Availability
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddAvailability;
