import { useState, useEffect } from "react";
import api from "../../components/User-management/api";
import Navbar from "../../components/navbar/Navbar";

const AddTutor = () => {
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [newTimeSlots, setNewTimeSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");

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


      setName("");
      setProfilePicture(null);
      setProfilePreview(null);
      setDescription("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to add tutor");
      setMessageType("error");
    }
  };

  const handleAddTimeSlot = () => {
    if (timeSlot && !newTimeSlots.includes(timeSlot)) {
      setNewTimeSlots([...newTimeSlots, timeSlot]);
      setTimeSlot("");
    }
  };

  const handleRemoveTimeSlot = (slot) => {
    setNewTimeSlots(newTimeSlots.filter((t) => t !== slot));
  };

  const handleSetAvailability = async () => {
    if (!selectedTutor || !selectedDate || newTimeSlots.length === 0) {
      setMessage("Please select a tutor, date, and at least one time slot.");
      setMessageType("error");
      return;
    }
    try {
      await api.post(`/tutors/${selectedTutor}/availability`, {
        date: selectedDate,
        timeSlots: newTimeSlots,
      });
      setMessage("Availability updated successfully");
      setMessageType("success");
      setNewTimeSlots([]);
    } catch (error) {
      setMessage("Failed to update availability");
      setMessageType("error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Add Tutor</h2>
        {message && <p className={`text-${messageType === "error" ? "red" : "green"}-500`}>{message}</p>}
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
            <input type="file" className="w-full p-2 border rounded" onChange={handleFileChange} accept="image/*" required />
            {profilePreview && <img src={profilePreview} alt="Profile Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Description</label>
            <textarea className="w-full p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Add Tutor</button>
        </form>
        <h2 className="text-2xl font-bold my-4">Set Availability</h2>
        <div className="mb-4">
          <label className="block font-semibold">Select Tutor</label>
          <select className="w-full p-2 border rounded" onChange={(e) => setSelectedTutor(e.target.value)} value={selectedTutor}>
            <option value="">Select a tutor</option>
            {tutors.map((tutor) => (
              <option key={tutor._id} value={tutor._id}>{tutor.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Select Date</label>
          <input type="date" className="w-full p-2 border rounded" onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate} />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Time Slots</label>
          <div className="flex gap-2">
            <input type="text" className="p-2 border rounded w-full" placeholder="e.g., 10:00 AM" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} />
            <button className="bg-gray-500 text-white p-2 rounded" onClick={handleAddTimeSlot}>Add</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {newTimeSlots.map((slot, index) => (
              <span key={index} className="bg-gray-200 p-2 rounded text-sm flex items-center">
                {slot} <button onClick={() => handleRemoveTimeSlot(slot)} className="ml-2 text-red-500">✕</button>
              </span>
            ))}
          </div>
        </div>
        <button className="bg-green-500 text-white p-2 rounded w-full" onClick={handleSetAvailability}>Set Availability</button>
      </div>
    </>
  );
};

export default AddTutor;
