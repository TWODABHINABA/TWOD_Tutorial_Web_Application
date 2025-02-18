// src/CategoryCoursesPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../components/User-management/api";

const CategoryCoursesPage = () => {
  const { categoryName } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const decodedCategoryName = decodeURIComponent(categoryName);
  // const [isMounted, setIsMounted] = useState(false);
  // const category = categories.find(
  //   (cat) => cat.name.toLowerCase() === decodedCategoryName.toLowerCase()
  // );

  console.log(categoryName);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/category/${categoryName}`); 
        setCourse(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchCourse();
    }
  }, [categoryName]);

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate__animated animate__fadeIn">
        <div className="max-w-md text-center">
          <div className="text-9xl mb-4">😕</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Category not found
          </h2>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans animate__animated animate__fadeIn">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {course.categoryType} Courses
          </h1>
          <div className="mt-2 h-1 w-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.category.map((module, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                module? "opacity-100" : "opacity-0"
              } transition-opacity duration-500`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <Link
                to={`/course/${encodeURIComponent(course.category)}`}
                className="block p-6"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-800">
                    {course}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105"
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
  );
};

export default CategoryCoursesPage;