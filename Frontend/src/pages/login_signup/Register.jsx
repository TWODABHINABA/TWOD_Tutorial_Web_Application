import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../components/User-management/api";
import Toast from "./Toast";
import ForgotPasswordFlow from "./ForgotPasswordFlow";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
  const [error, setError] = useState({ email: "", password: "" });
  const [valid, setValid] = useState({});
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleToast, setGoogleToast] = useState(null);
  const location = useLocation();

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]); // Set selected file
  };

  useEffect(() => {
    if (googleToast) {
      const timer = setTimeout(() => setGoogleToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [googleToast]);

  useEffect(() => {
    api
      .get("/check-admin")
      .then((response) => setAdminExists(response.data.adminExists))
      .catch((error) => console.error("Error checking admin existence", error));
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const error = queryParams.get("error");

    if (error) {
      setGoogleToast({ message: error, type: "error" });
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(setAction("Login"), document.title, newUrl);
      
    }
  }, [location.search]);

  const handleGoogleLogin = () => {
    window.open(
      "https://twod-tutorial-web-application-3brq.onrender.com/auth",
      "_self" || "http://localhost:6001/auth",
      "_self"
    );
    // window.open("http://localhost:6001/auth", "_self"); // local
  };

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidPhone = (phone) => {
    const isNumber = /^\d+$/.test(phone);
    const isLength = phone.length >= 10;

    return isNumber && isLength;
  };
  const isValidBirthday = (birthday) => /^\d{4}-\d{2}-\d{2}$/.test(birthday);
  // const isValidPassword = (password) => password.length >= 6;

  const isValidPassword = (password) => {
    const lengthValid = password.length >= 8 && password.length <= 20;
    const uppercaseValid = /[A-Z]/.test(password);
    const lowercaseValid = /[a-z]/.test(password);
    const digitValid = /\d/.test(password);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      lengthValid &&
      uppercaseValid &&
      lowercaseValid &&
      digitValid &&
      specialCharValid
    );
  };

  const handleValidation = (field, value) => {
    let error = "";
    let isValid = false;

    switch (field) {
      case "name":
        isValid = value.length > 2;
        error = isValid ? "" : "Name must be at least 3 characters";
        break;
      case "email":
        isValid = isValidEmail(value);
        error = isValid ? "" : "Invalid email format (example@mail.com)";
        break;
      case "phone":
        isValid = isValidPhone(value);
        error = isValid
          ? ""
          : "Phone number must contain only digits and be at least 10 characters long.";
        break;
      case "birthday":
        isValid = isValidBirthday(value);
        error = isValid ? "" : "Format: YYYY-MM-DD";
        break;
      case "password":
        isValid = isValidPassword(value);
        error = isValid ? "" : "";

        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    setValid((prev) => ({ ...prev, [field]: isValid }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Validation Errors:", errors);
    console.log("Validation Status:", valid);

    if (
      Object.values(errors).some((err) => err !== "") ||
      Object.values(valid).some((v) => !v)
    ) {
      setToast({
        show: true,
        message: "Please correct the errors",
        type: "error",
      });
      return;
    }

    const date = new Date(birthday);
    if (isNaN(date.getTime())) {
      return;
    }
    const formattedBirthday = `${date.getFullYear()}-${date.toLocaleString(
      "en-US",
      { month: "short" }
    )}-${String(date.getDate()).padStart(2, "0")}`;

    console.log("Formatted Birthday:", formattedBirthday);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", String(phone));
    formData.append("birthday", formattedBirthday);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const response = await api.post("/register", formData);
      console.log(response);
      setToast({
        show: true,
        message: "Registration Successful!",
        type: "success",
      });
      setAction("Login");
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      setToast({
        show: true,
        message: err.response?.data?.message || "Registration failed!",
        type: "error",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError({ email: "", password: "" });

    try {
      const response = await api.post("/login", { email, password });

      if (response.data.redirectTo) {
        setToast({ show: true, message: "Login Successful!", type: "success" });

        setTimeout(() => {
          navigate(
            response.data.redirectTo + `?email=${encodeURIComponent(email)}`
          );
        }, 3000);
      }

      if (response.data.token && response.data.role) {
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);
      }

      setToast({ show: true, message: "Login Successful!", type: "success" });

      const redirectPath =
        sessionStorage.getItem("redirectAfterLogin") || "/user";

      sessionStorage.removeItem("redirectAfterLogin");
      setTimeout(() => {
        setToast(false);
        if (window.location.pathname === redirectPath.split("?")[0]) {
          window.location.reload();
        } else {
          navigate(redirectPath);
        }
      }, 2000);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403 && error.response.data.redirectTo) {
          setToast({
            show: true,
            message: "Login Successful!",
            type: "success",
          });

          setTimeout(() => {
            navigate(
              error.response.data.redirectTo +
                `?email=${encodeURIComponent(email)}`
            );
          }, 3000);
        } else if (error.response.data.message === "Invalid Email") {
          // setError({ email: "Invalid Email", password: "" });
          setToast({
            show: true,
            message: "Invalid Email",
            type: "error",
          });
        } else if (error.response.data.message === "Invalid Password") {
          // setError({ email: "", password: "Incorrect Password" });
          setToast({
            show: true,
            message: "Incorrect Password",
            type: "error",
          });
        } else {
          // setError({ email: "", password: "Something went wrong. Try again." });
          setToast({
            show: true,
            message: "Something went wrong. Try again.",
            type: "error",
          });
        }
      } else {
        // setError({ email: "", password: "Network error. Please try again." });
        setToast({
          show: true,
          message: "Network error. Please try again.",
          type: "error",
        });
      }
    }
  };

  return (
    <div className="  rounded-lg shadow-lg z-10 ">
      <div className="flex flex-col items-center gap-2 w-full mb-8 ">
        <h1 className="text-3xl font-bold text-gray-800">{action}</h1>
        <div className="w-10 h-1 bg-orange-500 rounded-full"></div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false })}
        />
      )}
      {googleToast && (
        <Toast
          message={googleToast.message}
          type={googleToast.type}
          onClose={() => setGoogleToast(null)}
        />
      )}
      {action === "Login" ? (
        <form
          className="
          w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-xl overflow-hidden h-[60vh] overflow-y-auto"
          onSubmit={handleLogin}
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div>
                <input
                  name="email"
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-6 py-3 rounded-lg bg-white bg-opacity-80 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ease-in-out ${
                    error.email ? "border-red-500" : "border-gray-300"
                  } border`}
                  required
                />
                {error.email && (
                  <p className="text-red-500 text-sm mt-1">{error.email}</p>
                )}
              </div>

              <div className="relative w-full">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-6 py-3 pr-12 rounded-lg bg-white bg-opacity-80 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ease-in-out ${
                    error.password ? "border-red-500" : "border-gray-300"
                  } border`}
                  required
                />

                {error.password && (
                  <p className="text-red-500 text-sm mt-1">{error.password}</p>
                )}

                <button
                  type="button"
                  className="absolute right-3 top-7 transform -translate-y-1/2 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-6 h-6" />
                  ) : (
                    <EyeIcon className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
            <div className="relative md:pb-3">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="bg-blue-500 text-white p-3 rounded-lg shadow"
              >
                Forgot Password?
              </button>

              {isForgotPasswordOpen && (
                <ForgotPasswordFlow
                  isOpen={isForgotPasswordOpen}
                  setIsOpen={setForgotPasswordOpen}
                />
              )}
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
                className="w-full md:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
              >
                Login
              </button>
            </div>

            {/* <button
              onClick={handleGoogleLogin}
              className="max-md:gap-2 max-md:px-4 max-md:py-2 
  w-full max-w-sm mx-auto flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-800">
                Continue with Google
              </span>
            </button> */}

            <button
              onClick={handleGoogleLogin}
              className="max-md:gap-2 max-md:px-4 max-md:py-2 
        w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 
        rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-800">
                Continue with Google
              </span>
            </button>
          </div>
        </form>
      ) : (
        <form
          className=" max-md:p-3 
          w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto"
          onSubmit={handleRegister}
        >
          <div className="space-y-6 max-md:space-y-4">
            <div className="flex flex-col gap-4 max-md:gap-3">
              {[
                {
                  label: "Enter your name",
                  field: "name",
                  value: name,
                  setter: setName,
                },
                {
                  label: "Enter your Phone Number",
                  value: phone,
                  setter: setPhone,

                  field: "phone",
                },
                {
                  label: "Enter your Date of Birth (YYYY-MM-DD)",
                  field: "birthday",
                  value: birthday,
                  setter: setBirthday,
                },
                {
                  label: "Enter your email",
                  value: email,
                  setter: setEmail,
                  field: "email",
                },
              ].map(({ label, value, setter, field }) => (
                <div key={field} className="relative">
                  <input
                    type="text"
                    value={value}
                    placeholder={label}
                    onChange={(e) => {
                      setter(e.target.value);
                      handleValidation(field, e.target.value);
                    }}
                    className={`max-md:px-4 max-md:py-2 
                      w-full px-6 py-3 rounded-lg  bg-white bg-opacity-80 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ease-in-out ${
                        errors[field]
                          ? "border-red-500"
                          : valid[field]
                          ? "border-green-500"
                          : "border-gray-300"
                      } border`}
                    required
                  />
                  {valid[field] && (
                    <span className="absolute right-3 top-3 text-green-500 animate-pulse"></span>
                  )}
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  field="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // setter(e.target.value);
                    handleValidation("password", e.target.value);
                  }}
                  className={`max-md:px-4 max-md:py-2 
                    w-full px-6 py-3 rounded-lg bg-white bg-opacity-80 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ease-in-out ${
                      errors.password
                        ? "border-red-500"
                        : valid.password
                        ? "border-green-500"
                        : "border-gray-300"
                    } border`}
                  required
                />
                {/* {valid.password && (
                  <span className="absolute right-3 top-3 text-green-500 animate-pulse">
                    ✔
                  </span>
                )}
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )} */}
                <div className="mt-4 space-y-2 text-xs ">
                  <p className="text-gray-700 font-medium">
                    Password Strength:
                  </p>
                  <ul className="list-disc pl-6 md:grid md:grid-cols-2">
                    <li
                      className={`${
                        password.length >= 8 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      Minimum 8 characters
                    </li>
                    <li
                      className={`${
                        /[A-Z]/.test(password)
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      At least one uppercase letter
                    </li>
                    <li
                      className={`${
                        /[a-z]/.test(password)
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      At least one lowercase letter
                    </li>
                    <li
                      className={`${
                        /\d/.test(password) ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      At least one number
                    </li>
                    <li
                      className={`${
                        /[!@#$%^&*(),.?":{}|<>]/.test(password)
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      At least one special character
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="absolute right-4 top-3 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-6 h-6" />
                  ) : (
                    <EyeIcon className="w-6 h-6" />
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onPaste={(e) => e.preventDefault()} // Prevent pasting
                  className={`max-md:px-4 max-md:py-2 
                    w-full px-6 py-3 rounded-lg bg-white bg-opacity-80 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ease-in-out ${
                      confirmPassword && password !== confirmPassword
                        ? "border-red-500"
                        : confirmPassword && password === confirmPassword
                        ? "border-green-500"
                        : "border-gray-300"
                    } border`}
                  required
                />
                <button
                  type="button"
                  className=" absolute right-4 top-3 text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-6 h-6" />
                  ) : (
                    <EyeIcon className="w-6 h-6" />
                  )}
                </button>
              </div>

              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-sm">Passwords do not match.</p>
              )}

              {!adminExists && (
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-800">
                    Role
                  </label>
                  <select
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Select Picture
                </label>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="max-md:p-2
                  w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 max-md:gap-2">
              <button
                type="button"
                onClick={() => {
                  setAction("Login");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setToast({ show: false, message: "", type: "" });
                }}
                className="text-gray-600 hover:text-orange-500"
              >
                Already have an account? Login
              </button>
              <button
                type="submit"
                className="max-md:px-4 max-md:py-2 w-full md:w-auto px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
              >
                Sign Up
              </button>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="max-md:gap-2 max-md:px-4 max-md:py-2 
  w-full max-w-sm mx-auto flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-800">
                Continue with Google
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;

{
  /* <form
  className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
  onSubmit={handleRegister}
>
  <div className="space-y-6">
    <div className="flex flex-col gap-4">
      {[
        {
          label: "Enter your name",
          value: name,
          setter: setName,
          field: "name",
        },
        {
          label: "Enter your Phone Number",
          value: phone,
          setter: setPhone,
          field: "phone",
        },
        {
          label: "Enter your Date of Birth (YYYY-MM-DD)",
          value: birthday,
          setter: setBirthday,
          field: "birthday",
        },
        {
          label: "Enter your email",
          value: email,
          setter: setEmail,
          field: "email",
        },
        {
          label: "Enter your password",
          value: password,
          setter: setPassword,
          field: "password",
        },
      ].map(({ label, value, setter, field }) => (
        <div key={field} className="relative">
          <input
            type={field === "password" ? "password" : "text"}
            value={value}
            placeholder={label}
            onChange={(e) => {
              setter(e.target.value);
              handleValidation(field, e.target.value);
            }}
            className={`w-full px-6 py-3 rounded-lg bg-white bg-opacity-80 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ease-in-out ${
              errors[field]
                ? "border-red-500"
                : valid[field]
                ? "border-green-500"
                : "border-gray-300"
            } border`}
            required
          />
          {valid[field] && (
            <span className="absolute right-3 top-3 text-green-500 animate-pulse">
              ✔
            </span>
          )}
          {errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
          )}

          {label === "Enter your password" && (
            <div className="mt-4 space-y-2">
              <p className="text-gray-700 font-medium">Password Strength:</p>
              <ul className="list-disc pl-6">
                <li
                  className={`${
                    password.length >= 8 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Minimum 8 characters
                </li>
                <li
                  className={`${
                    /[A-Z]/.test(password) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  At least one uppercase letter
                </li>
                <li
                  className={`${
                    /[a-z]/.test(password) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  At least one lowercase letter
                </li>
                <li
                  className={`${
                    /\d/.test(password) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  At least one number
                </li>
                <li
                  className={`${
                    /[!@#$%^&*(),.?":{}|<>]/.test(password)
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  At least one special character
                </li>
              </ul>
            </div>
          )}
        </div>
      ))}

      {!adminExists && (
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-800">
            Role
          </label>
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 bg-white bg-opacity-80 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-lg font-semibold text-gray-800">
          Select Picture
        </label>
        <input
          type="file"
          name="profilePicture"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full px-6 py-3 rounded-lg bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
      </div>
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
        className="w-full md:w-auto px-2.5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
      >
        Sign Up
      </button>
    </div>

    <button
      onClick={handleGoogleLogin}
      className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-all mb-4"
    >
      Sign Up with Google
    </button>
  </div>
</form>; */
}
