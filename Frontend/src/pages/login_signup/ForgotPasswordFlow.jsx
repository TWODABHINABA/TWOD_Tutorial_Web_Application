import { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import api from "../../components/User-management/api";
import Toast from "./Toast";

const ForgotPasswordFlow = ({ isOpen, setIsOpen }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

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
  useEffect(() => {
    setIsValid(isValidPassword(password));
  }, [password]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/forgot-password", { email });
      setMaskedPhone(response.data.maskedPhone);
      setStep(2);
      setToast({
        show: true,
        message: "Email verified successfully!",
        type: "success",
      });
    } catch (error) {
      setToast({
        show: true,
        message: "Error: " + error.response?.data?.message,
        type: "error",
      });
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/verify-phone", { email, phone });
      setStep(3);
      setToast({
        show: true,
        message: "Phone number verified successfully!",
        type: "success",
      });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || "Invalid phone number", type: "error" });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/verify-otp", { email, otp });
      setStep(4);
      setToast({
        show: true,
        message: "OTP verified successfully!",
        type: "success",
      });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || "Invalid OTP", type: "error" });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPassword(password)) {
      setToast({
        show: true,
        message: "Password must meet all requirements!",
        type: "error",
      });
      return;
    }
    if (password !== confirmPassword)
      return setToast({
        show: true,
        message: "Passwords do not match",
        type: "error",
      });

    try {
      await api.post("/reset-password", { email, newPassword: password });
      setToast({
        show: true,
        message: "Password reset successful!",
        type: "success",
      });

      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.message || "Error resetting password",
        type: "error",
      });
    }
  };

  return (
    <Transition appear show={isOpen} as="div">
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClose={() => setIsOpen(false)}
      >
        {/* {toast.show && <Toast message={toast.message} onClose={() => setToast({ show: false, message: "" })} />} */}
        {toast.show && (
          <Toast
            key={toast.type}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false })}
          />
        )}
        <Transition.Child
          as="div"
          enter="transition-transform duration-300 ease-out"
          enterFrom="scale-95 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transition-transform duration-200 ease-in"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-95 opacity-0"
          className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-xl"
        >
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
            onClick={() => setIsOpen(false)}
          >
            ✖
          </button>

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold text-center">
                Forgot Password
              </h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter your email"
                required
              />
              <button
                type="submit"
                className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
              >
                Next
              </button>
            </form>
          )}

          {/* Step 2: Verify Phone */}
          {step === 2 && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold text-center">
                Verify Phone
              </h2>
              <p className="text-center text-gray-600">
                Enter your mobile number ending with <b>{maskedPhone}</b>
              </p>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Full mobile number"
                required
              />
              <button
                type="submit"
                className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
              >
                Send OTP
              </button>
            </form>
          )}

          {/* Step 3: Enter OTP */}
          {step === 3 && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold text-center">Enter OTP</h2>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter OTP"
                required
              />
              <button
                type="submit"
                className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
              >
                Verify OTP
              </button>
            </form>
          )}

          {step === 4 && (
            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <h2 className="text-2xl font-semibold text-center">
                Reset Password
              </h2>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(""); // Clear error on input
                  }}
                  // className="w-full p-3 border rounded-lg focus:ring-2 transition-all"
                  className={`w-full px-6 py-3 rounded-lg bg-white bg-opacity-80 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ease-in-out ${
                    password
                      ? isValid
                        ? "border-green-500"
                        : "border-red-500"
                      : "border-gray-300"
                  } border`}
                  placeholder="New Password"
                  required
                  onCopy={(e) => e.preventDefault()} // Disable Copy
                  onCut={(e) => e.preventDefault()} // Disable Cut
                  onPaste={(e) => e.preventDefault()} // Disable Paste
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-6 h-6" />
                  ) : (
                    <EyeIcon className="w-6 h-6" />
                  )}
                </button>
              </div>
              <div className="text-sm">
                <p
                  className={
                    password.length >= 8 && password.length <= 20
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {password.length >= 8 && password.length <= 20 ? "✓" : "•"}{" "}
                  8-20 characters
                </p>
                <p
                  className={
                    /[A-Z]/.test(password) ? "text-green-500" : "text-red-500"
                  }
                >
                  {/[A-Z]/.test(password) ? "✓" : "•"} At least one uppercase
                  letter
                </p>
                <p
                  className={
                    /[a-z]/.test(password) ? "text-green-500" : "text-red-500"
                  }
                >
                  {/[a-z]/.test(password) ? "✓" : "•"} At least one lowercase
                  letter
                </p>
                <p
                  className={
                    /\d/.test(password) ? "text-green-500" : "text-red-500"
                  }
                >
                  {/\d/.test(password) ? "✓" : "•"} At least one number
                </p>
                <p
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(password)
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "✓" : "•"} At least
                  one special character
                </p>
              </div>

              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  // className="w-full p-3 border rounded-lg focus:ring-2 transition-all"
                  className={`w-full px-6 py-3 rounded-lg bg-white bg-opacity-80 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ease-in-out ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-500"
                      : confirmPassword && password === confirmPassword
                      ? "border-green-500"
                      : "border-gray-300"
                  } border`}
                  placeholder="Confirm Password"
                  required
                  onCopy={(e) => e.preventDefault()} // Disable Copy
                  onCut={(e) => e.preventDefault()} // Disable Cut
                  onPaste={(e) => e.preventDefault()} // Disable Paste
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
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

              <button
                type="submit"
                className="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
              >
                Reset Password
              </button>
            </form>
          )}
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default ForgotPasswordFlow;
