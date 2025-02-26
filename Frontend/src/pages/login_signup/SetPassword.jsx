import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/User-management/api";

const SetPassword = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!isOpen) return null; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    try {
      const response = await api.post("/set-password", { email, password });
      localStorage.setItem("token", response.data.token);
      alert("Password set successfully!");
      onClose(); 
      navigate("/user"); 
    } catch (error) {
      setError("Error setting password. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full relative animate-fadeIn">

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Set Your Password
        </h2>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;