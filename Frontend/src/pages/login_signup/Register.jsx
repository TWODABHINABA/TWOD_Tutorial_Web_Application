import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/User-management/api";

const Register = ({ onClose, initialAction = "Sign Up" }) => {
  const [action, setAction] = useState(initialAction);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [birthday, setBirthday] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [adminExists, setAdminExists] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]); // Set selected file
  };

  useEffect(() => {
    api
      .get("/check-admin")
      .then((response) => setAdminExists(response.data.adminExists))
      .catch((error) => console.error("Error checking admin existence", error));
  }, []);

  const handleGoogleLogin = () => {
    // const password = prompt("Set a password for future logins:");
    // if (!password) 
    //   return alert("Password is required!");

    // localStorage.setItem("googlePassword", password); 
    window.open("https://twod-tutorial-web-application-3brq.onrender.com/auth", "_self");
    // window.open("http://localhost:6001/auth", "_self"); // local
  };

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await api.get("/auth/check");
  //       if (response.data.authenticated) {
  //         localStorage.setItem("token", response.data.token);
  //         navigate("/user");
  //       }
  //     } catch (error) {
  //       console.error("Google authentication check failed", error);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("birthday", birthday);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const response = await api.post("/register", formData);

      console.log(response.data);
      alert("User Registration Successful");
      setAction("Login");
    } catch (err) {
      console.error("Registration failed:", err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await api.post("/login", { email, password });
      console.log(userData);
      if (userData.data.token && userData.data.role) {
        localStorage.setItem("role", userData.data.role);
        localStorage.setItem("token", userData.data.token); // Save role
      }
      alert("Login Successful");
      navigate("/user");
    } catch (error) {
      alert("Error");
      navigate("/");
    }
  };

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 max-w-lg w-full">
      <div className="flex flex-col items-center gap-2 w-full mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{action}</h1>
        <div className="w-10 h-1 bg-orange-500 rounded-full"></div>
      </div>

      {action === "Login" ? (
        <form className="w-full" onSubmit={handleLogin}>
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <input
                name="email"
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 focus:outline-none"
                required
              />
              <input
                name="password"
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => setAction("Sign Up")}
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                Don't have an account? Sign Up
              </button>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-semibold transition-colors"
              >
                Login
              </button>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors mb-4"
            >
              Login with Google
            </button>
          </div>
        </form>
      ) : (
        <form className="w-full" onSubmit={handleRegister}>
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 "
                required
              />

              <input
                type="text"
                value={phone}
                placeholder="Enter your Phone Number"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 "
                required
              />

              <input
                type="text"
                value={birthday}
                placeholder="Enter your Date of Birth (YYYY-MMM-DD)"
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 "
                required
              />
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 "
                required
              />
              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 "
                required
              />

              {!adminExists && (
                <div className="mb-2">
                  <label className="block font-medium">Role</label>
                  <select
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
              <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => setAction("Login")}
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                Already have an account? Login
              </button>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
              >
                Register
              </button>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors mb-4"
            >
              Sign Up with Google
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;
