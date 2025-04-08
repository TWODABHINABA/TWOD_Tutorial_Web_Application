import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import api from "../../components/User-management/api";
import Footer from "../../components/footer/Footer";
import Toast from "../../pages/login_signup/Toast";

const AddTutor = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [profilePicture, setProfilePicture] = useState(null);
  // const [profilePreview, setProfilePreview] = useState(null);
  // const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  // const [subjects, setSubjects] = useState([]);
  // const [allSubjects, setAllSubjects] = useState([]);
  // const [newTutorId, setNewTutorId] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchSubjects = async () => {
  //     try {
  //       const response = await api.get("/subjects"); // Fetch subjects from backend
  //       setAllSubjects(response.data); // Store in state
  //     } catch (error) {
  //       console.error("Error fetching subjects:", error);
  //     }
  //   };

  //   fetchSubjects();
  // }, []);

  // const handleSelect = (e) => {
  //   const selectedSubject = e.target.value;
  //   if (selectedSubject && !subjects.includes(selectedSubject)) {
  //     setSubjects([...subjects, selectedSubject]);
  //   }
  // };

  // const removeSubject = (subject) => {
  //   setSubjects(subjects.filter((item) => item !== subject));
  // };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setProfilePicture(file);
  //     setProfilePreview(URL.createObjectURL(file)); // To show the preview
  //   }
  // };

  const handleAddTutor = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const tutorData = {
        name,
        email, // Ensure email is included
      };

      const response = await api.post("/tutors", tutorData, {
        headers: { "Content-Type": "application/json" },
      });

      // setMessage(response.data.message);
      // setMessageType("success");
      setToast({
        show: true,
        message: "Email and Password Sent Successful!",
        type: "success",
      });
      // navigate("/add-availability");
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.message || "Email Already Exist",
        type: "error",
      });
      // setMessageType("error");
    }
  };

  // const handleAddTutor = async (e) => {
  //   e.preventDefault();
  //   setMessage("");

  //   try {
  //     const formData = new FormData();
  //     formData.append("name", name);
  //     formData.append("profilePicture", profilePicture);
  //     formData.append("description", description);

  //     // Send subjects as a JSON array
  //     const formattedSubjects = subjects.map((subject) => subject.trim());
  //     formData.append("subjects", JSON.stringify(formattedSubjects)); // Send subjects as a JSON array

  //     const response = await api.post("/tutors", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     setMessage(response.data.message);
  //     setMessageType("success");
  //     navigate("/add-availability");
  //   } catch (error) {
  //     setMessage(error.response?.data?.error || "Failed to add tutor");
  //     setMessageType("error");
  //   }
  // };

  return (
    <>
      <Navbar />
      {/* <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mb-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Add Tutor</h2>
        {message && (
          <p
            className={`text-${messageType === "error" ? "red" : "green"}-500`}
          >
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

          <div className="mb-4">
            <label className="block font-semibold">Select Subjects</label>

            <div className="flex flex-wrap gap-2 mb-2">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
                >
                  {subject}
                  <button
                    onClick={() => removeSubject(subject)}
                    className="ml-2 text-white font-bold px-2"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>


            <select
              className="w-full p-2 border rounded"
              onChange={handleSelect}
              value=""
            >
              <option value="" disabled>
                Select a subject
              </option>
              {allSubjects
                .filter((subject) => !subjects.includes(subject)) // Hide already selected ones
                .map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Add Tutor
          </button>
        </form>
      </div> */}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false })}
        />
      )}
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mb-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Add Tutor</h2>
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
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Add Tutor
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default AddTutor;
