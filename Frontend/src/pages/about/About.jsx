import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

// Demo tutors data
const demoTutors = [
  {
    _id: "1",
    name: "John Doe",
    role: "Mathematics Tutor",
    about:
      "John has been teaching mathematics for over 10 years, specializing in algebra and calculus.",
    areasOfExpertise: ["Algebra", "Calculus", "Geometry"],
    profilePicture: "https://via.placeholder.com/150",
  },
  {
    _id: "2",
    name: "Jane Smith",
    role: "Literature Tutor",
    about:
      "Jane is passionate about literature and creative writing, helping students discover the beauty of language.",
    areasOfExpertise: ["Creative Writing", "Poetry", "Literary Analysis"],
    profilePicture: "https://via.placeholder.com/150",
  },
  {
    _id: "3",
    name: "Robert Brown",
    role: "Computer Science Tutor",
    about:
      "Robert specializes in programming and computer science, making complex topics accessible to beginners.",
    areasOfExpertise: ["Programming", "Data Structures", "Algorithms"],
    profilePicture: "https://via.placeholder.com/150",
  },
];

const About = () => {
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState(null);

  // Simulate an API call with demo data
  useEffect(() => {
    setTutors(demoTutors);
  }, []);

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

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
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 duration-300 p-6 flex flex-col justify-between"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={tutor.profilePicture}
                    alt={tutor.name}
                    className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-orange-500"
                  />
                  <h2 className="text-2xl font-semibold text-orange-500">
                    {tutor.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{tutor.role}</p>
                  <p className="text-gray-600 text-center mt-4 px-2">
                    {tutor.about}
                  </p>
                  <div className="mt-4 w-full">
                    <h3 className="text-sm font-bold text-orange-500 text-center">
                      Areas of Expertise:
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {tutor.areasOfExpertise.map((area, index) => (
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
