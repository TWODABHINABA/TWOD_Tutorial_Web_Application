import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import api from "../../components/User-management/api";
import { useParams } from "react-router-dom";

const About = () => {
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const {tutorName} = useParams()
  const tutorRef = useRef(null)

  console.log(tutorName)
  const getExpanded = (id)=>{
    setExpanded((prev)=>({
      ...prev,
      [id]:!prev[id], //toggle 
    }));
  }

  //code for tutor search
  useEffect(() => {
    if (tutorName && tutors.length > 0) {
      const matchedTutor = tutors.find((t) => 
        t.name.toLowerCase() === decodeURIComponent(tutorName).toLowerCase()
      );
  
      if (matchedTutor) {
        setTimeout(() => {
          const tutorElement = document.getElementById(matchedTutor._id);
          if (tutorElement) {
            tutorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 500);
      }
    }
  }, [tutorName, tutors]);

  

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await api.get("/tutors"); // Axios handles JSON parsing
        setTutors(response.data); // Use response.data directly
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch tutors");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  console.log(tutors);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAF3E0] animate-fade-in py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r text-orange-400 bg-clip-text ">
              Our Tutors
            </h1>
            <p className="text-gray-600 mt-3">
              Meet our experienced and passionate tutors.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {tutors.map((tutor) => (
              <div
                key={tutor._id}
                id = {tutor._id}
                // ref={tutorRef}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 duration-300 p-6 flex flex-col justify-between"
              >
                <div className="flex flex-col items-center">
                  <img
                    // src={tutor.profilePicture}
                    src={
                      `https://twod-tutorial-web-application-3brq.onrender.com${tutor.profilePicture}` ||
                      `http://localhost:6001${tutor.profilePicture}`
                    }
                    alt={tutor.name}
                    className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-orange-500"
                  />
                  <h2 className="text-2xl font-semibold text-orange-500">
                    {tutor.name}
                  </h2>

                  <p className="text-gray-600 text-center mt-4 px-2">
                    {expanded[tutor._id]
                      ? tutor.description
                      : tutor.description.substring(0, 100) + "..."}
                    <button
                      onClick={() => getExpanded(tutor._id)}
                      className="text-blue-500 ml-2"
                    >
                      {expanded[tutor._id] ? "Read Less" : "Read More"}
                    </button>
                  </p>
                  <div className="mt-4 w-full">
                    <h3 className="text-sm font-bold text-orange-500 text-center">
                      Areas of Expertise:
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {tutor.subjects.map((area, index) => (
                        <li
                          key={index}
                          className="text-xs text-gray-600 text-center"
                        >
                          • {area}
                        </li>
                      ))}
                    </ul>
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
