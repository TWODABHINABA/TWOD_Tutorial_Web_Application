import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} min-h-screen flex flex-col`}> 
      {/* Navbar */}
      <nav className="bg-blue-600 dark:bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full shadow-lg z-50">
        <h1 className="text-xl font-bold">EduLearn</h1>
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:underline">Home</a>
          <a href="/courses" className="hover:underline">Courses</a>
          <a href="/pricing" className="hover:underline">Pricing</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/contact" className="hover:underline">Contact</a>
          <a href="/faq" className="hover:underline">FAQ</a>
          <a href="/support" className="hover:underline">Support</a>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-all" 
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
          <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-blue-600 dark:bg-gray-800 text-white p-4 space-y-4 fixed top-16 w-full">
          <a href="/" className="hover:underline">Home</a>
          <a href="/courses" className="hover:underline">Courses</a>
          <a href="/pricing" className="hover:underline">Pricing</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/contact" className="hover:underline">Contact</a>
          <a href="/faq" className="hover:underline">FAQ</a>
          <a href="/support" className="hover:underline">Support</a>
        </div>
      )}

      {/* Header */}
      <header className="text-center py-20 mt-16">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Course Pricing & Plans
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-3xl mx-auto">
          Choose the perfect plan that suits your learning needs.
        </p>
      </header>

      {/* Pricing Section */}
      <div className="flex flex-wrap justify-center gap-8 p-6">
        {[ "Free", "Basic", "Premium", "Enterprise" ].map((plan, index) => (
          <div key={index} className="w-80 h-auto min-h-[400px] p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 flex flex-col justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{plan} Plan</h2>
            <p className="text-xl mt-2 text-gray-700 dark:text-gray-300">{plan === "Free" ? "₹0" : plan === "Basic" ? "₹999/month" : plan === "Premium" ? "₹1999/month" : "Custom Pricing"}</p>
            <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
              {plan === "Free" ? (
                <>
                  <li>✔ Access to basic courses</li>
                  <li>✔ 1 course per month</li>
                </>
              ) : plan === "Basic" ? (
                <>
                  <li>✔ Access to all courses</li>
                  <li>✔ 5 courses per month</li>
                  <li>✔ Email support</li>
                </>
              ) : plan === "Premium" ? (
                <>
                  <li>✔ Unlimited courses</li>
                  <li>✔ 24/7 priority support</li>
                  <li>✔ Access to exclusive content</li>
                  <li>✔ Certification upon completion</li>
                </>
              ) : (
                <>
                  <li>✔ Custom solutions for organizations</li>
                  <li>✔ Dedicated account manager</li>
                  <li>✔ Advanced analytics & reporting</li>
                  <li>✔ API access</li>
                  <li>✔ All Access to every course</li>
                </>
              )}
            </ul>
            <button
              className={`w-full mt-4 py-2 rounded-lg font-semibold ${policyAccepted ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 cursor-not-allowed"}`}
              onClick={() => policyAccepted && navigate("/dashboard")}
              disabled={!policyAccepted}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>

      {/* Policy Section */}
      <div className="text-center p-6">
        <h2 className="text-2xl font-semibold text-red-500">Terms & Conditions 📜</h2>
        <p className="text-gray-700 dark:text-gray-300 mt-2">By subscribing to a plan, you agree to our terms:</p>
        <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside mt-4">
          <li>📌 Access to courses based on your plan.</li>
          <li>📌 Subscription fees are non-refundable.</li>
          <li>📌 You must adhere to community guidelines.</li>
          <li>📌 Enterprise users receive custom onboarding.</li>
        </ul>
        <label className="flex items-center justify-center space-x-2 mt-4 cursor-pointer">
          <input type="checkbox" className="w-5 h-5" onChange={() => setPolicyAccepted(!policyAccepted)} />
          <span className="text-gray-700 dark:text-gray-300">I accept the terms & conditions</span>
        </label>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 dark:bg-gray-800 text-white text-center p-4 mt-8">
        <p>&copy; {new Date().getFullYear()} EduLearn. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Pricing;
