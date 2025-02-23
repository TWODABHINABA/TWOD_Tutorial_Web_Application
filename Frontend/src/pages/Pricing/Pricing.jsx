import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen p-12 flex flex-col items-center relative transition-all duration-500`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 left-6 p-3 rounded-full bg-gray-200 dark:bg-gray-800 shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Header Section */}
      <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        Course Pricing & Plans
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl text-center">
        Choose the perfect plan that suits your learning needs. Our plans offer
        flexibility and access to high-quality courses with expert mentorship.
      </p>

      {/* Guide/Manual Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl mb-12 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">
          How Our Plans Work
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          1️⃣ Choose a plan based on your learning goals. <br />
          2️⃣ Accept the policy terms before proceeding. <br />
          3️⃣ Get instant access to our courses and expert mentorship. <br />
          4️⃣ Upgrade anytime for unlimited learning!
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="flex flex-wrap justify-center gap-8">
        {[
          {
            title: "Free Plan",
            price: "₹0",
            features: [
              "✔ Access to basic courses",
              "✔ 1 course per month",
              "✔ Email support",
              "🚀 Ideal for beginners",
            ],
            button: "Sign Up",
            gradient:
              "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
            shadow: "shadow-lg",
          },
          {
            title: "Basic Plan",
            price: "₹999/month",
            features: [
              "✔ Access to all courses",
              "✔ 5 courses per month",
              "✔ Priority support",
              "📚 Certificate upon completion",
              "🌟 Early access to new courses",
            ],
            button: "Choose Plan",
            gradient:
              "from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800",
            shadow: "shadow-xl",
          },
          {
            title: "Premium Plan",
            price: "₹1999/month",
            features: [
              "✔ Unlimited course access",
              "✔ Unlimited courses per month",
              "✔ 24/7 premium support",
              "✔ Exclusive webinars",
              "🎓 Personal mentorship",
              "🏆 Career guidance",
            ],
            button: "Get Started",
            gradient:
              "from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800",
            shadow: "shadow-2xl",
          },
        ].map((plan, index) => (
          <div
            key={index}
            className={`w-80 rounded-2xl p-8 text-center bg-gradient-to-b ${plan.gradient} ${plan.shadow} transform transition-all hover:scale-105 hover:shadow-2xl`}
          >
            <h2 className="text-3xl font-semibold mb-4">{plan.title}</h2>
            <p className="text-2xl font-bold text-white mb-6">{plan.price}</p>
            <ul className="mb-6 space-y-3 text-gray-800 dark:text-gray-300">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>

            {/* Policy Acceptance Check */}
            {policyAccepted ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl shadow-md hover:bg-gray-200 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700 transition-all"
              >
                {plan.button}
              </button>
            ) : (
              <button
                className="w-full bg-gray-400 text-white font-semibold py-3 rounded-xl shadow-md cursor-not-allowed"
                disabled
              >
                Accept Policy to Proceed
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Policy Section */}
      <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl text-center">
        <h2 className="text-2xl font-semibold mb-4 text-red-500">
          Terms & Conditions 📜
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          By subscribing to a plan, you agree to our terms:
        </p>
        <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside mb-6">
          <li>📌 You will have access to courses based on your plan.</li>
          <li>📌 Subscription fees are non-refundable.</li>
          <li>📌 You must adhere to our community guidelines.</li>
          <li>📌 Plans can be upgraded anytime, but downgrades take effect in the next cycle.</li>
        </ul>

        <label className="flex items-center justify-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5"
            onChange={() => setPolicyAccepted(!policyAccepted)}
          />
          <span className="text-gray-700 dark:text-gray-300">
            I accept the terms & conditions
          </span>
        </label>
      </div>
    </div>
  );
};

export default Pricing;
