import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../User-management/api";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    courses: [],
    categories: [],
    tutors: [],
    persons: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Function to fetch course ID
  const fetchCourseId = async (courseName, courseType) => {
    try {
      const response = await api.get(
        `/courses?name=${courseName}&courseType=${courseType}`
      );
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0]._id;
      }
      return null;
    } catch (err) {
      console.error("Error fetching course ID:", err);
      return null;
    }
  };

  // Function to handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await api.get(`/search?query=${query}`);
      const filteredCourses = data.courses.filter((course) =>
        course.name.toLowerCase().includes(query.toLowerCase())
      );

      setResults({
        courses: filteredCourses,
        categories: data.categories || [],
        tutors: data.tutors || [],
        persons: data.persons || [],
      });
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = async (item, type) => {
    if (type === "category") {
      navigate(`/category/${item.name}`);
    } else {
      const id = await fetchCourseId(item.name, item.courseType);
      if (id) {
        navigate(`/courses/${id}`);
      }
    }
  };

  // Hide the results if clicking outside the container
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setResults({
        courses: [],
        categories: [],
        tutors: [],
        persons: [],
      });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSearch} className="flex">
        <label htmlFor="search-input" className="sr-only">
          Search
        </label>
        <div className="relative flex-grow">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-orange-500" />
          <input
            type="text"
            id="search-input"
            className="block w-full pl-10 pr-16 py-2 border border-orange-500 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
            placeholder="Search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
        >
          Search
        </button>
      </form>

      {loading && (
        <p className="mt-2 text-sm text-gray-500">Searching...</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {(results.courses.length > 0 ||
        results.categories.length > 0 ||
        results.tutors.length > 0 ||
        results.persons.length > 0) && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-80 overflow-y-auto">
          {results.courses.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs sm:text-sm font-semibold text-orange-500 uppercase">
                Courses
              </h3>
              {results.courses.map((course, index) => (
                <div
                  key={`course-${index}`}
                  className="p-2 cursor-pointer hover:bg-gray-100 border-b last:border-0 text-sm sm:text-base"
                  onClick={() => handleResultClick(course, "course")}
                >
                  <span className="font-medium">{course.name}</span>{" "}
                  <span className="text-gray-500">
                    ({course.courseType})
                  </span>
                </div>
              ))}
            </div>
          )}

          {results.categories.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs sm:text-sm font-semibold text-blue-500 uppercase">
                Categories
              </h3>
              {results.categories.map((category, index) => (
                <div
                  key={`category-${index}`}
                  className="p-2 cursor-pointer hover:bg-gray-100 border-b last:border-0 text-sm sm:text-base"
                  onClick={() => handleResultClick(category, "category")}
                >
                  {category.name}
                </div>
              ))}
            </div>
          )}

          {results.tutors.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs sm:text-sm font-semibold text-green-500 uppercase">
                Tutors
              </h3>
              {results.tutors.map((tutor, index) => (
                <div
                  key={`tutor-${index}`}
                  className="p-2 cursor-pointer hover:bg-gray-100 border-b last:border-0 text-sm sm:text-base"
                  onClick={() => handleResultClick(tutor, "tutor")}
                >
                  {tutor.name}
                </div>
              ))}
            </div>
          )}

          {results.persons.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs sm:text-sm font-semibold text-purple-500 uppercase">
                Persons
              </h3>
              {results.persons.map((person, index) => (
                <div
                  key={`person-${index}`}
                  className="p-2 cursor-pointer hover:bg-gray-100 border-b last:border-0 text-sm sm:text-base"
                  onClick={() => handleResultClick(person, "person")}
                >
                  {person.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
