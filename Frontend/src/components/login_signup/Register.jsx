import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../User-management/api";

const Register = () => {
  const [action, setAction] = useState("Sign Up");
  const [name,setName]=useState("");
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
      localStorage.setItem("token", userData.data.token);
      alert("Login Successful");
      navigate("/");
    } catch (error) {
      alert("Error");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-200 to-blue-400">
      <div className="flex flex-col items-center justify-center w-[85.4vh] h-[95vh] bg-red-300 bg-opacity-50 rounded-2xl shadow-2xl p-6">
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="text-4xl font-bold text-black">{action}</div>
          <div className="w-10 h-1 bg-black rounded-full"></div>
        </div>

        {action === "Login" ? (
          <form></form>
        ) : (
          <form className="mt-8 flex flex-col gap-4" onSubmit={handleRegister}>
            <div className="flex items-center w-[68vh] h-16 bg-gray-200 rounded-md px-4">
              <input
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e)=>setName(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center w-[68vh] h-16 bg-gray-200 rounded-md px-4">
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center w-[68vh] h-16 bg-gray-200 rounded-md px-4">
              <input
                type="password"
                value={password}
                placeholder="Enter your Password"
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              {action !== "Sign Up" && (
                <div
                  className="text-2xl cursor-pointer"
                  onClick={() => setAction("Sign Up")}
                >
                  &rarr; Sign-In
                </div>
              )}
              {action !== "Login" && (
                <div
                  className="text-2xl cursor-pointer"
                  onClick={() => setAction("Login")}
                >
                  &rarr; Login
                </div>
              )}
              <button type="submit">Register</button>
            </div>
          </form>
        )}

        {action === "Sign Up" ? (
          <form></form>
        ) : (
          <form className="mt-8 flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex items-center w-[68vh] h-16 bg-gray-200 rounded-md px-4">
              <input
                name="email"
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
            <div className="flex items-center w-[68vh] h-16 bg-gray-200 rounded-md px-4">
              <input
                name="password"
                type="password"
                value={password}
                placeholder="Enter your Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>
            <div className="text-gray-600 text-lg cursor-pointer mt-4">
              Forgot Password?{" "}
              <span className="text-blue-600">Click Here!</span>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              {action !== "Sign Up" && (
                <div
                  className="text-2xl cursor-pointer"
                  onClick={() => setAction("Sign Up")}
                >
                  &rarr; Sign-In
                </div>
              )}
              {action !== "Login" && (
                <div
                  className="text-2xl cursor-pointer"
                  onClick={() => setAction("Login")}
                >
                  &rarr; Login
                </div>
              )}
              <button
                className="w-32 h-12 bg-blue-600 text-white rounded-full text-2xl font-bold"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
