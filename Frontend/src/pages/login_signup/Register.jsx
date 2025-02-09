import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/User-management/api";
// import UserService from '../User-management/UserService';
// import user_id from '../Assets/ID.png';
// import user_pic from '../Assets/person.png';
// import email_pic from "../../assets/../assets./rea";
// import password_pic from '../Assets/password.png';
// import role_pic from '../Assets/role.png';
const Register = () => {
  const [action, setAction] = useState("Sign Up");
  const [name,setName]=useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
  const navigate = useNavigate();
//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//   };
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register",{name, email, password});
    //   setFormData({ name: "", email: "", password: "" });
      alert("User Registration Successful");
      setAction("Login");
    } catch (error) {
      alert("User Registration Failed");
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await UserService.login(email, password);
      if (userData.token) {
        localStorage.setItem("token", userData.token);
        alert("Login Successful");
        navigate("/profile");
      } else {
        alert("Error");
      }
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
              <button
                className="w-32 h-12 bg-blue-600 text-white rounded-full text-2xl font-bold"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
        )}
        {action === "Sign Up" ? (
          <form></form>
        ) : (
          <form className="mt-8 flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex items-center w-[68vh] h-16 bg-gray-200 rounded-md px-4">
              {/* <img src={field.img} alt="" className="mr-4" /> */}
              <input
                name="mail"
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
              {/* <img src={field.img} alt="" className="mr-4" /> */}
              <input
                name="password"
                type="password"
                value={password}
                placeholder="Enter your Password"
                onChange={(e) => {
                  setEmail(e.target.value);
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
