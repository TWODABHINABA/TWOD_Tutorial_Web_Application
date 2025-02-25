import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaUserTie, FaChalkboardTeacher, FaCertificate, FaInfoCircle, FaBookOpen, FaClock, FaHeadset, FaGlobe, FaShieldAlt, FaUsers } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import CustomNavbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

const Pricing = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} min-h-screen flex flex-col`}> 
      <CustomNavbar />

      {/* Header */}
      <header className="text-center py-20 mt-16" data-aos="fade-down">
        <h1 className="text-5xl font-extrabold text-blue-600">Course Pricing & Plans</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-3xl mx-auto">
          Choose the perfect plan that suits your learning needs and career goals.
        </p>
      </header>

      {/* Pricing Section */}
      <div className="flex flex-wrap justify-center gap-8 p-6">
        {[ "Free", "Basic", "Premium", "Enterprise" ].map((plan, index) => (
          <div key={index} className="w-80 h-auto min-h-[400px] p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 flex flex-col justify-between" data-aos="fade-right">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{plan} Plan</h2>
            <p className="text-xl mt-2 text-gray-700 dark:text-gray-300">{plan === "Free" ? "₹0" : plan === "Basic" ? "₹999/month" : plan === "Premium" ? "₹1999/month" : "Custom Pricing"}</p>
            <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
              {plan === "Free" ? (
                <>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />Access to basic courses</li>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />1 course per month</li>
                </>
              ) : plan === "Basic" ? (
                <>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />Access to all courses</li>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />5 courses per month</li>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />Email support</li>
                </>
              ) : plan === "Premium" ? (
                <>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />Unlimited courses</li>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />24/7 priority support</li>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />Exclusive content</li>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />Certification upon completion</li>
                </>
              ) : (
                <>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />Custom solutions for organizations</li>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />Dedicated account manager</li>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />Advanced analytics & reporting</li>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />API access</li>
                  <li><FaCheckCircle className="inline mr-2 text-green-500" />Full access to every course</li>
                </>
              )}
            </ul>
            <button
              className="w-full mt-4 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setShowPopup(true)}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>

      {/* More Information Section */}
      <section className="mt-12 p-6 text-center bg-gray-200 dark:bg-gray-700" data-aos="fade-left">
        <h2 className="text-3xl font-bold mb-4 text-blue-600">Why to choose us ?</h2>
        <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">We offer tailored solutions for individual learners and businesses.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {[{icon: FaUserTie, label: "Business Plans"}, {icon: FaChalkboardTeacher, label: "Expert Mentors"}, {icon: FaCertificate, label: "Certified Courses"}, {icon: FaBookOpen, label: "Extensive Learning Resources"}, {icon: FaClock, label: "Flexible Learning Hours"}, {icon: FaHeadset, label: "24/7 Support"}, {icon: FaGlobe, label: "Global Access"}, {icon: FaShieldAlt, label: "Secure Payments"}, {icon: FaUsers, label: "Community Networking"}].map((item, index) => (
            <div key={index} className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <item.icon className="text-4xl text-blue-500" />
              <p className="mt-2 text-gray-700 dark:text-gray-300">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Terms & Conditions Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" data-aos="zoom-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg text-center">
            <h2 className="text-2xl font-semibold text-red-500">Terms & Conditions 📜</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2">By subscribing to a plan, you agree to our terms:</p>
            <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside mt-4 text-left">
              <li>📌 Access to courses based on your plan.</li>
              <li>📌 Subscription fees are non-refundable.</li>
              <li>📌 You must adhere to community guidelines.</li>
              <li>📌 Enterprise users receive custom onboarding.</li>
            </ul>
            <label className="flex items-center justify-center space-x-2 mt-4 cursor-pointer">
              <input type="checkbox" className="w-5 h-5" onChange={() => setPolicyAccepted(!policyAccepted)} />
              <span className="text-gray-700 dark:text-gray-300">I accept the terms & conditions</span>
            </label>
            <div className="mt-4 flex justify-between">
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={() => setShowPopup(false)}>Cancel</button>
              <button className={`px-4 py-2 rounded-lg font-semibold ${policyAccepted ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 cursor-not-allowed"}`} disabled={!policyAccepted} onClick={() => { policyAccepted && navigate("/dashboard"); }}>Proceed</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Pricing;
