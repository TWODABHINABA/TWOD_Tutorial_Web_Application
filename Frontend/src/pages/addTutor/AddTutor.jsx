// import { useState, useEffect } from "react";
// import Navbar from "../../components/navbar/Navbar";
// import axios from "axios";
// import api from "../../components/User-management/api";


// const AddTutor = () => {
//   const [name, setName] = useState("");
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [profilePreview, setProfilePreview] = useState(null);
//   const [description, setDescription] = useState("");
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("error");
//   const [tutors, setTutors] = useState([]);
//   // const [selectedTutor, setSelectedTutor] = useState("");
//   // const [selectedDate, setSelectedDate] = useState("");
//   // const [newAvailableDates, setNewAvailableDates] = useState([]);
//   // const [timeSlot, setTimeSlot] = useState("");
//   // const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     const fetchTutors = async () => {
//       try {
//         const response = await api.get("/tutors");
//         setTutors(response.data);
//       } catch (error) {
//         console.error("Failed to fetch tutors");
//       }
//     };
//     fetchTutors();
//   }, []);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfilePicture(file);
//       setProfilePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleAddTutor = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("profilePicture", profilePicture);
//       formData.append("description", description);

//       const response = await api.post("/tutors", formData);
//       setMessage(response.data.message);
//       setMessageType("success");

//       setShowPopup(true);
//       setName("");
//       setProfilePicture(null);
//       setProfilePreview(null);
//       setDescription("");
//       // window.location.href("/add-availability");
//     } catch (error) {
//       setMessage(error.response?.data?.error || "Failed to add tutor");
//       setMessageType("error");
//     }
//   };

//   // const handleAddDate = () => {
//   //   if (
//   //     selectedDate &&
//   //     !newAvailableDates.some((d) => d.date === selectedDate)
//   //   ) {
//   //     setNewAvailableDates([
//   //       ...newAvailableDates,
//   //       { date: selectedDate, timeSlots: [] },
//   //     ]);
//   //     setSelectedDate("");
//   //   }
//   // };

//   // const handleRemoveDate = (date) => {
//   //   setNewAvailableDates(newAvailableDates.filter((d) => d.date !== date));
//   // };

//   // const handleAddTimeSlotToDate = (date) => {
//   //   if (timeSlot) {
//   //     setNewAvailableDates(
//   //       newAvailableDates.map((d) =>
//   //         d.date === date && !d.timeSlots.includes(timeSlot)
//   //           ? { ...d, timeSlots: [...d.timeSlots, timeSlot] }
//   //           : d
//   //       )
//   //     );
//   //     setTimeSlot("");
//   //   }
//   // };

//   // const handleRemoveTimeSlotFromDate = (date, slot) => {
//   //   setNewAvailableDates(
//   //     newAvailableDates.map((d) =>
//   //       d.date === date
//   //         ? { ...d, timeSlots: d.timeSlots.filter((s) => s !== slot) }
//   //         : d
//   //     )
//   //   );
//   // };

//   // const handleSetAvailability = async () => {
//   //   const requestData = {
//   //     availability: newAvailableDates.map((item) => ({
//   //       date: item.date,
//   //       timeSlots: item.timeSlots,
//   //     })),
//   //   };

//   //   console.log(
//   //     "📤 Sending API Request:",
//   //     JSON.stringify(requestData, null, 2)
//   //   );

//   //   try {
//   //     const response = await axios.post(
//   //       `http://localhost:6001/tutors/${selectedTutor}/availability`,
//   //       requestData
//   //     );
//   //     console.log("✅ Response:", response.data);
//   //   } catch (error) {
//   //     console.error(
//   //       "❌ Error setting availability:",
//   //       error.response?.data || error.message
//   //     );
//   //   }
//   // };

//   return (
//     <>
//       <Navbar />
//       <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
//         <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
//           Add Tutor
//         </h2>
//         {message && (
//           <p
//             className={`text-${
//               messageType === "error" ? "red" : "green"
//             }-500 text-center font-semibold`}
//           >
//             {message}
//           </p>
//         )}
//         <form onSubmit={handleAddTutor} className="space-y-4">
//           <div>
//             <label className="block font-semibold text-gray-700">Name</label>
//             <input
//               type="text"
//               className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label className="block font-semibold text-gray-700">
//               Profile Picture
//             </label>
//             <input
//               type="file"
//               className="w-full p-2 border rounded-lg cursor-pointer"
//               onChange={handleFileChange}
//               accept="image/*"
//               required
//             />
//             {profilePreview && (
//               <img
//                 src={profilePreview}
//                 alt="Profile Preview"
//                 className="mt-4 w-32 h-32 object-cover rounded-lg border"
//               />
//             )}
//           </div>
//           <div>
//             <label className="block font-semibold text-gray-700">
//               Description
//             </label>
//             <textarea
//               className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600 transition duration-200"
//           >
//             Add Tutor
//           </button>
//         </form>
//       </div>

      
//     </>
//   );
// };

// export default AddTutor;


import { useState} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import api from "../../components/User-management/api";

const AddTutor = () => {
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [showPopup, setShowPopup] = useState(false);
  // const [newTutorId, setNewTutorId] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleAddTutor = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("profilePicture", profilePicture);
      formData.append("description", description);

      const response = await api.post("/tutors", formData);
      setMessage(response.data.message);
      setMessageType("success");
      navigate("/add-availability");
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to add tutor");
      setMessageType("error");
    }
  };


  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Add Tutor</h2>
        {message && (
          <p className={`text-${messageType === "error" ? "red" : "green"}-500`}>
            {message}
          </p>
        )}
        <form onSubmit={handleAddTutor}>
          <div className="mb-4">
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Profile Picture</label>
            <input
              type="file"
              className="w-full p-2 border rounded"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
            {profilePreview && (
              <img
                src={profilePreview}
                alt="Profile Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
            onClick={()=>{if(messageType==="success")
              navigate("/add-availability");
            }}
          >
            Add Tutor
          </button>
        </form>
      </div>

      {/* {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-xl font-bold mb-4">Tutor Added Successfully!</h2>
            <p className="mb-4">Now, set availability for this tutor.</p>
            <button
              className="bg-green-500 text-white p-2 rounded w-full"
              // onClick={handleGoToAvailability}
            >
              Set Availability
            </button>
          </div>
        </div>
      )} */}
    </>
  );
};

export default AddTutor;


