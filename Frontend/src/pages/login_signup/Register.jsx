
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/User-management/api";

const Register = ({ onClose, initialAction = "Sign Up" }) => {

  const [action, setAction] = useState(initialAction);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data =await api.post("/register", {name, email, password});
      // localStorage.setItem("token", data.token);
      console.log(data);
      alert("User Registration Successful");
      setAction("Login");
    } catch (err) {
      console.error("Registration failed: 500", err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData=await api.post("/login", {email, password});
      const t=localStorage.setItem("token", userData.data.token);
      alert("Login Successful");
      navigate("/user");
      // console.log(t);
    } catch (error) {
      alert("Error");
    }
  };

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 max-w-lg w-full">
      <div className="flex flex-col items-center gap-2 w-full mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{action}</h1>
        <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
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
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="password"
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => setAction("Sign Up")}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Don't have an account? Sign Up
              </button>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
              >
                Login
              </button>
            </div>
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
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => setAction("Login")}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Already have an account? Login
              </button>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;
