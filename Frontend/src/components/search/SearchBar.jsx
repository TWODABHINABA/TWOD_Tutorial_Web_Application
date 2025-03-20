// import React, { useState } from "react";
// import { FaSearch } from "react-icons/fa";

// const SearchBar = () => {
//   const [query, setQuery] = useState("");

//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log("Searching for:", query);
//   };

//   return (
//     <form
//       onSubmit={handleSearch}
//       className="w-full max-w-lg mx-auto sm:w-[150%]"
//     >
//       <label
//         htmlFor="search-input"
//         className="mb-2 text-sm font-medium text-gray-900 sr-only"
//       >
//         Search
//       </label>
//       <div className="relative">
//         {/* Search Icon */}
//         <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
//           <FaSearch className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
//         </div>

//         {/* Search Input */}
//         <input
//           type="text"
//           id="search-input"
//           className="block w-full p-2 sm:p-3 pl-8 sm:pl-10 text-xs sm:text-sm text-gray-900 border border-orange-500 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 appearance-none"
//           placeholder="Search Courses..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           required
//         />

//         {/* Search Button */}
//         <button
//           type="submit"
//           className="absolute right-1.5 bottom-1.5 text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 transition-colors text-orange-500 hover:bg-orange-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg"
//         >
//           Search
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SearchBar;

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import api from "../User-management/api";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); // Store search results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await api.get(`/search?query=${query}`); // ✅ Corrected API call
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (item) => {
    navigate(`/courses/${item.name.replace(/\s+/g, "-").toLowerCase()}`); 
  };

  return (
    <div className="relative w-full max-w-lg mx-auto sm:w-[150%]">
      <form onSubmit={handleSearch}>
        <label
          htmlFor="search-input"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
            <FaSearch className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            id="search-input"
            className="block w-full p-2 sm:p-3 pl-8 sm:pl-10 text-xs sm:text-sm text-gray-900 border border-orange-500 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />

          {/* Search Button */}
          <button
            type="submit"
            className="absolute right-1.5 bottom-1.5 text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 transition-colors text-orange-500 hover:bg-orange-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg"
          >
            Search
          </button>
        </div>
      </form>

      {/* Loading Indicator */}
      {loading && <p className="text-sm text-gray-500 mt-2">Searching...</p>}

      {/* Error Message */}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {/* Search Results Dropdown */}
      {results &&
        Object.keys(results).some((key) => results[key].length > 0) && (
          <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {Object.entries(results).map(([category, items]) =>
              items.length > 0 ? (
                <div key={category} className="p-2">
                  <h3 className="text-sm font-semibold text-orange-500">
                    {category.toUpperCase()}
                  </h3>
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 border-b last:border-none cursor-pointer hover:bg-gray-100"
                      onClick={() => handleResultClick(item)}
                    >
                      {`${item.category} - ${item.name}`}
                    </div>
                  ))}
                </div>
              ) : null
            )}
          </div>
        )}
    </div>
  );
};

export default SearchBar;
