import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import api from "../../components/User-management/api";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const About = () => {
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { tutorName } = useParams();
  const cardRefs = useRef({});

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await api.get("/tutors");
        setTutors(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch tutors");
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  useEffect(() => {
    if (tutorName && tutors.length > 0) {
      const tutor = tutors.find(t => t.name.toLowerCase() === tutorName.toLowerCase());
      if (tutor) {
        setExpandedId(tutor._id);
        // Scroll to the tutor card
        setTimeout(() => {
          const tutorElement = cardRefs.current[tutor.name];
          if (tutorElement) {
            tutorElement.scrollIntoView({ behavior: "smooth", block: "center" });
            tutorElement.classList.add("border-4", "border-orange-500", "shadow-2xl");
            setTimeout(() => {
              tutorElement.classList.remove("border-4", "border-orange-500", "shadow-2xl");
            }, 2000);
          }
        }, 500);
      }
    }
  }, [tutorName, tutors]);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FFF8F1] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center">
            <motion.h1
              className="text-4xl font-bold text-orange-400"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Tutors
            </motion.h1>
            <motion.p
              className="text-gray-600 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Meet our experienced and passionate tutors.
            </motion.p>
          </header>

          {expandedId ? (
  // 👉 When a tutor is selected
  <div className="flex flex-col lg:flex-row gap-6">
    {/* Left Half - Expanded Tutor */}
    <div className="lg:w-1/2 w-full">
      {tutors
        .filter((tutor) => tutor._id === expandedId)
        .map((tutor) => (
          <motion.div
            key={tutor._id}
            ref={(el) => (cardRefs.current[tutor.name] = el)}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            layout
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
          >
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-orange-400 shadow-lg mb-4">
              <img
                src={`https://twod-tutorial-web-application-3brq.onrender.com${tutor.profilePicture}`}
                alt={tutor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-semibold text-orange-600 mb-3">{tutor.name}</h2>
            <p className="text-gray-700 mb-4 text-center">{tutor.description}</p>
            <h3 className="text-sm font-bold text-orange-500 mb-2">Areas of Expertise:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {tutor.subjects.map((subject, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-orange-400/90 text-white text-xs rounded-full shadow"
                >
                  {subject}
                </span>
              ))}
            </div>
            <button
              onClick={() => setExpandedId(null)}
              className="mt-6 px-5 py-2 bg-orange-500 text-white rounded-full text-sm font-medium shadow hover:scale-105 transition"
            >
              Close
            </button>
          </motion.div>
        ))}
    </div>

    {/* Right Half - Other Tutors */}
    <div className="lg:w-1/2 w-full flex flex-col gap-6">
      {tutors
        .filter((tutor) => tutor._id !== expandedId)
        .map((tutor, i) => (
          <motion.div
            key={tutor._id}
            ref={(el) => (cardRefs.current[tutor.name] = el)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            layout
            className="bg-white/90 rounded-xl overflow-hidden shadow hover:shadow-orange-300 p-4 cursor-pointer"
            onClick={() => setExpandedId(tutor._id)}
          >
            <div className="flex items-center gap-4">
              <img
                src={`https://twod-tutorial-web-application-3brq.onrender.com${tutor.profilePicture}`}
                alt={tutor.name}
                className="w-16 h-16 rounded-full border-2 border-orange-400 object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold text-orange-600">{tutor.name}</h2>
                {/* <h3 className="text-sm font-bold text-orange-500 mb-2">Areas of Expertise:</h3> */}
                <br></br>
      
            <div className="flex flex-wrap justify-center gap-2">
              {tutor.subjects.map((subject, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-orange-400/90 text-white text-xs rounded-full shadow"
                >
                  {subject}
                </span>
              ))}
            </div>
              </div>
            </div>
          </motion.div>
        ))}
    </div>
  </div>
) : (
  // 👉 Default view when no tutor is selected
  <div className="flex justify-center gap-6 flex-wrap">
    {[0, 1, 2].map((colIdx) => (
      <div key={colIdx} className="flex flex-col gap-6 w-full max-w-xs">
        {tutors
          .filter((_, i) => i % 3 === colIdx)
          .map((tutor, i) => (
            <motion.div
              key={tutor._id}
              ref={(el) => (cardRefs.current[tutor.name] = el)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              layout
              className="relative bg-white/90 rounded-2xl overflow-hidden shadow-xl hover:shadow-orange-300 transition-all duration-300 cursor-pointer flex flex-col items-center p-5"
              onClick={() => setExpandedId(tutor._id)}
            >
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-orange-400 shadow-lg mb-4">
                <img
                  src={`https://twod-tutorial-web-application-3brq.onrender.com${tutor.profilePicture}`}
                  alt={tutor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-orange-600 mb-2 text-center">
                {tutor.name}
              </h2>
              <h3 className="text-sm font-bold text-orange-500 mb-2">Areas of Expertise:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {tutor.subjects.map((subject, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-orange-400/90 text-white text-xs rounded-full shadow"
                >
                  {subject}
                </span>
              ))}
            </div>
            </motion.div>
          ))}
      </div>
    ))}
  </div>
)}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
