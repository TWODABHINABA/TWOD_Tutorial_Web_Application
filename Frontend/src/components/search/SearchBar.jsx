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


  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        setError("");
        try {
          const { data } = await api.get(`/search?query=${query}`);
          console.log("Suggestions API Response:", data);
          const filteredCourses = data.courses.filter((course) =>
            course.name.toLowerCase().includes(query.toLowerCase())
          );

          const uniqueCategories = [];
          const categorySet = new Set();
          data.courses.forEach((course) => {
            if (!categorySet.has(course.courseType.toLowerCase())) {
              categorySet.add(course.courseType.toLowerCase());
              uniqueCategories.push({ courseType: course.courseType });
            }
          });
          setResults({
            courses: filteredCourses,
            categories: uniqueCategories || [],
            tutors: data.tutors || [],
            persons: data.persons || [],
          });
        } catch (err) {
          console.error("Suggestion error:", err);
          setError("Failed to fetch suggestions.");
        } finally {
          setLoading(false);
        }
      } else {
        setResults({ courses: [], categories: [], tutors: [], persons: [] });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // console.log("CATEGORY COURSE TYPEEEEEEEEE", results.categories);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // If the query contains a grade (e.g., "grade 10"), use that.
    const gradeMatch = query.match(/grade\s*\d+/i);
    if (gradeMatch) {
      // Use the extracted grade (case-insensitive match)
      navigate(`/courses/${encodeURIComponent(gradeMatch[0].trim())}`);
    } else if (results.categories.length > 0) {
      // Otherwise, treat the entire query as a subject.
      // Convert the query to lowercase to enforce case-insensitivity.
      const subject = query.trim().toLowerCase();
      console.log("Subjectsssssssssssss", subject);
      navigate(`/category/${encodeURIComponent(subject)}`);
    }
  };

  const handleResultClick = async (item, type) => {
    setQuery(""); // Clear search query
    setResults({ courses: [], categories: [], tutors: [], persons: [] }); // Clear results

    try {
      switch (type) {
        case "course":
          // Directly navigate using course ID from search results
          if (item._id) {
            navigate(`/courses/${item._id}`);
          } else {
            console.error("Course ID not found in search result:", item);
          }
          break;

        case "category":
          // Navigate to category page using encoded category name
          navigate(`/category/${encodeURIComponent(item.courseType)}`);
          break;

        case "tutor":
          // Navigate to tutor profile page
          if (item._id) {
            // console.log('hello')
            navigate(`/tutors/${item.name}`);
            // console.log(`/tutor/${item._id}`);
          } else {
            console.error("Tutor ID not found in search result:", item);
          }
          break;

        default:
          console.warn("Unknown result type:", type);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      setError("Failed to navigate to selected result");
    }
  };

  // Hide suggestions when clicking outside the container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setResults({ courses: [], categories: [], tutors: [], persons: [] });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch}>
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FaSearch className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            id="search-input"
            className="w-full h-12 sm:h-12 pl-10 sm:pl-12 pr-24 sm:pr-28 text-sm sm:text-base text-gray-800 border-2 border-orange-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all placeholder-gray-400"
            placeholder="Search courses, subjects, tutors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />

          {/* Search Button */}
          <button
            type="submit"
            className="absolute inset-y-1 right-1 w-20 sm:w-24 px-4 bg-orange-500 text-white font-medium text-sm sm:text-base rounded-lg hover:bg-orange-600 active:bg-orange-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {(results.courses.length > 0 ||
        results.tutors.length > 0 ||
        results.courses.length > 0) && (
        <div className="absolute w-full mt-2 bg-white border-2 border-orange-100 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50">
          {/* Course Suggestions */}
          {results.courses.length > 0 && (
            <div className="py-2">
              <h3 className="px-4 py-2 text-sm font-bold text-orange-600 bg-orange-50">
                COURSES
              </h3>
              {results.courses.map((course, index) => (
                <div
                  key={index}
                  className="px-4 py-3 text-sm sm:text-base text-gray-700 hover:bg-orange-50 cursor-pointer transition-colors border-b border-orange-100 last:border-0"
                  onClick={() => handleResultClick(course, "course")}
                >
                  {course.name}
                  <span className="block text-xs text-gray-500 mt-1">
                    {course.courseType}
                  </span>
                </div>
              ))}
            </div>
          )}

          {results.categories.length > 0 && (
            <div className="py-2">
              <h3 className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50">
                CATEGORIES
              </h3>
              {results.categories.map((category, index) => (
                <div
                  key={index}
                  className="px-4 py-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors border-b border-blue-100 last:border-0"
                  onClick={() => handleResultClick(category, "category")}
                >
                  {category.courseType}
                </div>
              ))}
            </div>
          )}

          {results.tutors.length > 0 && (
            <div className="py-2">
              <h3 className="px-4 py-2 text-sm font-bold text-green-600 bg-green-50">
                TUTORS
              </h3>
              {results.tutors.map((tutor, index) => (
                <div
                  key={index}
                  className="px-4 py-3 text-sm sm:text-base text-gray-700 hover:bg-green-50 cursor-pointer transition-colors border-b border-green-100 last:border-0"
                  onClick={() => handleResultClick(tutor, "tutor")}
                >
                  {tutor.name}
                  {tutor.subjects && tutor.subjects.length > 0 && (
                    <span className="block text-xs text-gray-500 mt-1">
                      {tutor.subjects.join(", ")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading and Error States */}
      {loading && (
        <div className="absolute w-full mt-2 text-center text-sm text-orange-600">
          Searching...
        </div>
      )}
      {error && (
        <div className="absolute w-full mt-2 text-center text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
