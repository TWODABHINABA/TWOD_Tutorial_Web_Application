import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import api from "../../components/User-management/api";
import Footer from "../../components/footer/Footer";
import Toast from "../../pages/login_signup/Toast";
import { ClipLoader } from "react-spinners";

const AddTutor = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
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
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleAddTutor = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    finally {
      setLoading(false); // Stop loading
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
        <ClipLoader size={80} color="#FFA500" />
      </div>
    );

  return (
    <>
      <Navbar />
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
            disabled={loading}
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-colors ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {loading ? "Processing..." : "Add Tutor"}
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default AddTutor;
