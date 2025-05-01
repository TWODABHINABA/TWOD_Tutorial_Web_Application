import React, { useState, useRef } from "react";
import { FiBell, FiGrid, FiHelpCircle } from "react-icons/fi";
import BellDropdown from "./BellDropdown";
import { useNavigate } from "react-router-dom";

const Navbar = ({ title = "Dashboard", user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between max-sm:justify-items-stretch max-sm:pl-16 items-center p-3 max-sm:p-3 bg-orange-50 border-b border-orange-300">
      <div className="text-xl sm:text-2xl font-bold text-orange-500 max-sm:text-lg sm:pl-36">
        {title}
      </div>

      <div className="flex items-center max-sm:space-x-3 space-x-10">
        <button className="text-orange-500 hover:text-orange-600">
          <BellDropdown />
        </button>
        <button className="text-orange-500 hover:text-orange-600">
          <FiGrid className="text-lg md:text-2xl" />
        </button>
        <button className="text-orange-500 hover:text-orange-600">
          <FiHelpCircle className="text-lg md:text-2xl" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button className="flex items-center" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <img
              src={`https://twod-tutorial-web-application-3brq.onrender.com${
                user?.profilePicture || "/placeholder.jpg"
              }`}
              alt="Profile"
              className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
            />
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
              <a href="/user" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</a>
              <a href="/privacy-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Privacy</a>
              <a href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Contact</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
