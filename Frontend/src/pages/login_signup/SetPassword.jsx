import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/User-management/api";
import Toast from "./Toast";
import { ClipLoader } from "react-spinners";

const SetPassword = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [valid, setValid] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const isValidPassword = (password) => {
    return (
      password.length >= 8 &&
      password.length <= 20 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");

    if (!isValidPassword(password)) {
      setError(
        "Password must be 8-20 characters long, include an uppercase letter, lowercase letter, number, and special character."
      );
      return;
    }

    try {
      const response = await api.post("/set-password", { email, password });
      localStorage.setItem("token", response.data.token);

      setToast({ show: true, message: "Password set successfully!", type: "success" });

 
      setTimeout(() => {
        setToast({ show: false });
        setTimeout(() => {
          onClose();
          navigate("/user");
        }, 500); 
      }, 1500); 
    } catch (error) {
      setError("Error setting password. Try again.");

      setToast({ show: true, message: "Error setting password", type: "error" });

      setTimeout(() => setToast({ show: false }), 1500);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={80} color="#FFA500" />
      </div>
    );
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false })}
        />
      )}

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

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setValid(isValidPassword(e.target.value));
              setError(null);
            }}
            required
            className={`p-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
              error
                ? "border-red-500 focus:ring-red-500"
                : valid
                ? "border-green-500 focus:ring-green-500"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          />

          <p className="text-sm text-gray-600">
            Password must be:
            <span
              className={
                password.length >= 8 ? "text-green-500" : "text-red-500"
              }
            >
              {" "}
              8+ chars,{" "}
            </span>
            <span
              className={
                /[A-Z]/.test(password) ? "text-green-500" : "text-red-500"
              }
            >
              1 uppercase,{" "}
            </span>
            <span
              className={
                /[a-z]/.test(password) ? "text-green-500" : "text-red-500"
              }
            >
              1 lowercase,{" "}
            </span>
            <span
              className={
                /\d/.test(password) ? "text-green-500" : "text-red-500"
              }
            >
              1 number,{" "}
            </span>
            <span
              className={
                /[!@#$%^&*(),.?":{}|<>]/.test(password)
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              1 special char.
            </span>
          </p>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
            disabled={!valid}
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
