import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", query);
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="w-full max-w-lg mx-auto sm:w-[150%]"
    >
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
          className="block w-full p-2 sm:p-3 pl-8 sm:pl-10 text-xs sm:text-sm text-gray-900 border border-orange-500 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 appearance-none"
          placeholder="Search Courses..."
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
  );
};

export default SearchBar;