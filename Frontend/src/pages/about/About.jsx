import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import api from "../../components/User-management/api";
import { useParams } from "react-router-dom";

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

        // Remove highlight after 2 seconds
        setTimeout(() => {
          tutorElement.classList.remove("border-4", "border-orange-500", "shadow-2xl");
        }, 2000);
      }, 500); // Small delay ensures scrolling happens after the component updates
    }
  }, [tutorName, tutors]); // Now listens to tutorName changes too!

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAF3E0] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-orange-400">Our Tutors</h1>
            <p className="text-gray-600 mt-3">Meet our experienced and passionate tutors.</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutors.map((tutor) => (
              <div
                key={tutor._id}
                ref={(el) => (cardRefs.current[tutor.name] = el)}
                id={tutor._id}
                className={`relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl transition-all p-6 flex flex-col justify-between cursor-pointer ${
                  expandedId === tutor._id ? "h-auto" : "h-[500px]"
                }`}
              >
                {/* Profile Picture */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src={`https://twod-tutorial-web-application-3brq.onrender.com${tutor.profilePicture}` || `http://localhost:6001${tutor.profilePicture}`}
                    alt={tutor.name}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-orange-500 shadow-lg"
                  />
                  <h2 className="text-2xl font-bold text-orange-500">{tutor.name}</h2>

                  {/* Description Section */}
                  <div
                    className="text-gray-600 mt-4 px-4 transition-all duration-300 text-base"
                    style={{
                      maxHeight: expandedId === tutor._id ? "none" : "120px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {tutor.description}
                    {expandedId !== tutor._id && (
                      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#FAF3E0]"></div>
                    )}
                  </div>

                  {/* Read More Button */}
                  <button
                    onClick={() => setExpandedId(expandedId === tutor._id ? null : tutor._id)}
                    className="text-blue-500 mt-2 font-medium hover:underline"
                  >
                    {expandedId === tutor._id ? "Read Less" : "Read More"}
                  </button>

                  {/* Expertise Section */}
                  <div className="mt-4 w-full">
                    <h3 className="text-sm font-bold text-orange-500">Areas of Expertise:</h3>
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                      {tutor.subjects.map((area, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-orange-300 to-orange-500 text-white text-xs rounded-full shadow-md"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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
