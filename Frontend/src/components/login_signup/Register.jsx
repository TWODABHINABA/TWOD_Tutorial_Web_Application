
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD:Frontend/src/components/login_signup/Register.jsx
import api from "../User-management/api";
=======
import api from "../../components/User-management/api";

const Register = ({ onClose, initialAction = "Sign Up" }) => {
>>>>>>> 6a115f04063c5da386039160130617b85725717a:Frontend/src/pages/login_signup/Register.jsx

  const [action, setAction] = useState(initialAction);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD:Frontend/src/components/login_signup/Register.jsx

  const navigate = useNavigate();


=======

  const navigate = useNavigate();
>>>>>>> 6a115f04063c5da386039160130617b85725717a:Frontend/src/pages/login_signup/Register.jsx

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD:Frontend/src/components/login_signup/Register.jsx
      const data =await api.post("/register", {name, email, password});
      // localStorage.setItem("token", data.token);
      console.log(data);
      alert("User Registration Successful");
      setAction("Login");
    } catch (err) {
      console.error("Registration failed: 500", err.message);
=======
      await api.post("/register", { name, email, password });
      alert("User Registration Successful");
      onClose(); 
    } catch (error) {
      alert("User Registration Failed");
>>>>>>> 6a115f04063c5da386039160130617b85725717a:Frontend/src/pages/login_signup/Register.jsx
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD:Frontend/src/components/login_signup/Register.jsx
      const userData=await api.post("/login", {email, password});
      localStorage.setItem("token", userData.data.token);
      alert("Login Successful");
      navigate("/");
    } catch (error) {
      alert("Error");
=======

      const userData = await UserService.login(email, password);
      if (userData.token) {
        localStorage.setItem("token", userData.token);
        alert("Login Successful");
        navigate("/profile");
        onClose(); 
      }
    } catch (error) {
      alert("Login Failed");
>>>>>>> 6a115f04063c5da386039160130617b85725717a:Frontend/src/pages/login_signup/Register.jsx
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
<<<<<<< HEAD:Frontend/src/components/login_signup/Register.jsx

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
=======
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => setAction("Sign Up")}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Don't have an account? Sign Up
              </button>
>>>>>>> 6a115f04063c5da386039160130617b85725717a:Frontend/src/pages/login_signup/Register.jsx
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
