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
    if (tutorName && cardRefs.current[tutorName]) {
      setTimeout(() => {
        const tutorElement = cardRefs.current[tutorName];
        tutorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        tutorElement.classList.add("border-4", "border-orange-500", "shadow-2xl");
        setTimeout(() => {
          tutorElement.classList.remove("border-4", "border-orange-500", "shadow-2xl");
        }, 2000);
      }, 500);
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

          <div className="flex justify-center gap-6 flex-wrap">
            {[0, 1, 2].map((colIdx) => (
              <div key={colIdx} className="flex flex-col gap-6 w-full max-w-xs">
                {tutors
                  .filter((_, i) => i % 3 === colIdx)
                  .map((tutor, i) => {
                    const isExpanded = expandedId === tutor._id;
                    return (
                      <motion.div
                        key={tutor._id}
                        ref={(el) => (cardRefs.current[tutor.name] = el)}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        layout
                        className="relative bg-white/90 rounded-2xl overflow-hidden shadow-xl hover:shadow-orange-300 transition-all duration-300 cursor-pointer flex flex-col items-center p-5"
                      >
                        <motion.div
                          className="w-36 h-36 rounded-full overflow-hidden border-4 border-orange-400 shadow-lg mb-4"
                          whileHover={{ rotate: 1 }}
                        >
                          <img
                            src={`https://twod-tutorial-web-application-3brq.onrender.com${tutor.profilePicture}`}
                            alt={tutor.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>

                        <h2 className="text-xl font-semibold text-orange-600 mb-2 text-center">
                          {tutor.name}
                        </h2>

                        <motion.div
                          className="text-sm text-gray-700 text-center px-2 w-full"
                          initial={false}
                          animate={{ height: isExpanded ? "auto" : 60 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            overflow: "hidden",
                            position: "relative",
                          }}
                          layout
                        >
                          <div className="relative z-10">{tutor.description}</div>
                          {!isExpanded && (
                            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-[#FFF8F1] to-transparent pointer-events-none z-20" />
                          )}
                        </motion.div>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const willExpand = expandedId !== tutor._id;
                            setExpandedId(willExpand ? tutor._id : null);
                            if (willExpand && cardRefs.current[tutor.name]) {
                              setTimeout(() => {
                                cardRefs.current[tutor.name].scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                              }, 350);
                            }
                          }}
                          className="mt-3 px-5 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full text-sm font-medium shadow-md hover:scale-105 hover:shadow-lg transition duration-200"
                        >
                          {isExpanded ? "Read Less" : "Read More"}
                        </motion.button>

                        <div className="mt-4 text-center w-full">
                          <h3 className="text-sm font-bold text-orange-500 mb-2">
                            Areas of Expertise:
                          </h3>
                          <div className="flex flex-wrap justify-center gap-2 px-3">
                            {tutor.subjects.map((subject, idx) => (
                              <motion.span
                                key={idx}
                                whileHover={{ scale: 1.1 }}
                                className="px-3 py-1 bg-orange-400/90 text-white text-xs rounded-full shadow transition-transform duration-200"
                              >
                                {subject}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
