import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../components/User-management/api";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const CategoryCoursesPage = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const coursesRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
        console.log("Categories Dataaaaa", response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (expandedCategory && coursesRef.current) {
      coursesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expandedCategory]);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const fetchCourseId = async (courseName, courseType) => {
    try {
      const response = await api.get(
        `/courses?name=${courseName}&courseType=${courseType}`
      );
      console.log("Fetched Course:", response.data);
      return response.data._id;
    } catch (error) {
      console.error("Error fetching course ID:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen  p-6 font-sans animate__animated animate__fadeIn bg-[#FAF3E0]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-500 bg-clip-text text-transparent">
            Courses
          </h1>
          <div className="mt-2 h-1 w-20 bg-gradient-to-r from-orange-400 to-orange-400 rounded-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                onClick={() => toggleCategory(cat.category)}
              >
       
                <img
                  src={cat.courses[0].courseTypeImage}
                  alt={cat.category}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex justify-between items-center ">
                  <h3 className="text-lg font-semibold text-orange-800">
                    {cat.category}
                  </h3>
                  <span
                    className={`transition-transform duration-300 ${
                      expandedCategory === cat.category
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                </div>
              </div>
            ))}

            {/* {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                onClick={() => toggleCategory(cat.category)}
              >
                <img
                  src={
                    cat.courseTypeImage
                      ? cat.courseTypeImage
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={cat.category}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex justify-between items-center ">
                  <h3 className="text-lg font-semibold text-orange-800">
                    {cat.category}
                  </h3>
                  <span
                    className={`transition-transform duration-300 ${
                      expandedCategory === cat.category
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                </div>
              </div>
            ))} */}
          </div>

          {expandedCategory && (
            <div
              ref={coursesRef}
              className="bg-gray-50 mt-6 p-6 rounded-xl shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-orange-500 mb-4">
                {expandedCategory} Courses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories
                  .find((cat) => cat.category === expandedCategory)
                  ?.courses.map((course, i) => {
                    const courseName =
                      typeof course === "object" ? course.name : course;
                    // const courseType = typeof course === "object" ? course.courseType : expandedCategory;
                    return (
                      <div
                        key={i}
                        onClick={async (e) => {
                          e.preventDefault();
                          console.log(
                            "Clicked Course:",
                            courseName,
                            "Type:",
                            course.courseType
                          ); // ✅ Now it will not be undefined
                          const id = await fetchCourseId(
                            courseName,
                            course.courseType
                          );
                          if (id) window.location.href = `/courses/${id}`;
                        }}
                        className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
                      >
                        <img
                          src={course.nameImage}
                          alt={course.nameImage}
                          className="w-full h-48 object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60 group-hover:from-gray-900 transition-all duration-300"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h4 className="text-xl font-bold text-white">
                            {courseName}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
            
            
            
            
            {/* {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                onClick={() => toggleCategory(cat.category)}
              >
                <img
                  src={
                    cat.courseTypeImage
                      ? cat.courseTypeImage
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={cat.category}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-orange-800">
                    {cat.category}
                  </h3>
                  <span
                    className={`transition-transform duration-300 ${
                      expandedCategory === cat.category
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {expandedCategory && (
            <div
              ref={coursesRef}
              className="bg-gray-50 mt-6 p-6 rounded-xl shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-orange-500 mb-4">
                {expandedCategory} Courses
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories
                  .find((cat) => cat.category === expandedCategory)
                  ?.courses.map((course, i) => (
                    <div
                      key={i}
                      onClick={async (e) => {
                        e.preventDefault();
                        console.log(
                          "Clicked Course:",
                          course.name,
                          "Type:",
                          course.courseType
                        );
                        const id = await fetchCourseId(
                          course.name,
                          course.courseType
                        );
                        if (id) window.location.href = `/courses/${id}`;
                      }}
                      className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <img
                        src={
                          course.nameImage
                            ? course.nameImage
                            : "https://via.placeholder.com/300x200?text=No+Image"
                        }
                        alt={course.name}
                        className="w-full h-48 object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60 group-hover:from-gray-900 transition-all duration-300"></div>

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-xl font-bold text-white">
                          {course.name}
                        </h4>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )} */}

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-orange-500 border-orange-500    hover:bg-orange-500 hover:text-white transition-transform duration-300 transform hover:scale-105"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryCoursesPage;
