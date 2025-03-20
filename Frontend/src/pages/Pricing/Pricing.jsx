import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import CustomNavbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const pricingData = [
  { duration: "30 MINS", price: "$35", description: "Quick concept revision & Q/A session", features: ["Personalized attention", "Flexible scheduling"] },
  { duration: "1 HOUR", price: "$60", description: "Deep-dive into complex topics with problem-solving", features: ["In-depth explanations", "Homework assistance"], popular: true },
  { duration: "1.5 HOURS", price: "$80", description: "Comprehensive learning session with step-by-step guidance", features: ["Concept mastery", "Exam strategies"] },
  { duration: "2 HOURS", price: "$100", description: "Intensive study session for thorough understanding & practice", features: ["Extensive practice", "Doubt clearing"] },
];

const PricingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <CustomNavbar />

      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col flex-grow">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8" data-aos="fade-up">
          Pricing Plans
        </h1>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingData.map((plan, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              className={`p-6 rounded-lg shadow-lg bg-white border-2 flex flex-col ${
                plan.popular ? "border-yellow-500" : "border-gray-300"
              }`}
            >
              {plan.popular && (
                <span className="text-sm text-white bg-yellow-500 px-3 py-1 rounded-full mb-2 inline-block" data-aos="fade-down">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold text-gray-800" data-aos="fade-right">
                {plan.duration}
              </h3>
              <p className="text-2xl font-bold text-blue-600 mt-2" data-aos="fade-left">
                {plan.price}
              </p>
              <p className="text-gray-600 mt-2" data-aos="fade-right">
                {plan.description}
              </p>
              <ul className="mt-4 space-y-2 flex-grow" data-aos="fade-up">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    ✅ {feature}
                  </li>
                ))}
              </ul>
              
              {/* Enroll Now Button - Aligned */}
              <button
                onClick={() => navigate("/booking")}
                className="mt-auto w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                data-aos="fade-up"
              >
                Enroll Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
