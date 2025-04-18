import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CustomNavbar from "../../components/navbar/Navbar";
import Foote from "../../components/footer/Footer";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import api from "../../components/User-management/api";

const Contact = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      // Disabled animations for screens < 768px
      disable: window.innerWidth < 768,
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setAiResponse(null);

    try {
      const response = await api.post(
        "/contact",
        formData
      );
      setAiResponse(
        response.data.aiResponse || "Your message has been sent successfully."
      );
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={80} color="#FFA500" />
      </div>
    );

  return (
    <>
      <CustomNavbar />
      <section className="py-12 px-5 bg-[#FAF3E0] ">
        <div className="max-w-6xl mx-auto px-5">
          <header className="text-center mb-12" data-aos={window.innerWidth >= 768 ? "fade-down" : ""}>
            <h1 className="text-4xl  max-md:text-2xl text-orange-400 font-bold mb-3">
              Contact Us
            </h1>
            <p className="text-lg max-md:text-base text-gray-600">
              Have questions or feedback? We’d love to hear from you.
            </p>
          </header>
          <div className="flex flex-wrap gap-10 items-start max-md:flex-col">
            <div className="flex-1 min-w-[250px]" data-aos={window.innerWidth >= 768 ? "fade-right" : ""}>
              <h2 className="text-3xl text-orange-500 font-semibold mb-4 max-md:text-xl ">
                Get in Touch
              </h2>
              <p className="text-gray-700 mb-4 max-md:text-sm">
                Reach out to TUTOR for any queries regarding our courses or
                services.
              </p>
              <ul className="space-y-2 text-gray-700  max-md:text-sm">
                <li>
                  <strong>Email:</strong> support@tutor.com
                </li>
                <li>
                  <strong>Phone:</strong> +1 234 567 890
                </li>
                <li>
                  <strong>Address:</strong> 123 Learning Lane, Knowledge City,
                  Education State
                </li>
              </ul>
            </div>

            <div
              className="flex-1 min-w-[250px] bg-white border border-gray-300 rounded-lg p-6 shadow-sm"
              data-aos={window.innerWidth >= 768 ? "fade-left" : ""}
            >
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 max-md:p-2 max-md:text-sm"
                />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 max-md:p-2 max-md:text-sm"
                />
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 max-md:p-2 max-md:text-sm"
                />
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Your Message"
                  required
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 max-md:p-2 max-md:text-sm"
                ></textarea>
                <button
                  type="submit"
                  className="max-md:py-2 max-md:px-3 py-3 px-4 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition duration-300"
                >
                  Send Message
                </button>
                {aiResponse && (
                  <p className="mt-3 text-green-600 max-md:text-sm">{aiResponse}</p>
                )}
                {error && <p className="mt-3 text-red-600 max-md:text-sm">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
      <Foote />
    </>
  );
};

export default Contact;
