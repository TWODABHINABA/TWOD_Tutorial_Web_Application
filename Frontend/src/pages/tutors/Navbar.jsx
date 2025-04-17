import React from "react";
import { FiBell, FiGrid, FiHelpCircle } from "react-icons/fi";
import BellDropdown from "./BellDropdown";

const Navbar = ({ title = "Dashboard", user}) => {
  return (
    <nav className="flex justify-between max-sm:justify-items-stretch max-sm:pl-16 items-center p-3 max-sm:p-[14px] bg-orange-50 border-b border-orange-300">
      {/* Left Section: Dynamic Title */}
      <div className="text-xl sm:text-2xl font-bold text-orange-500 max-sm:text-lg sm:pl-[36%]">
        {title}
      </div>
      {/* Right Section: Icons */}
      <div className="flex items-center max-sm:space-x-3 space-x-10">
        <button className="text-orange-500 hover:text-orange-600">
          {/* <FiBell className="text-lg md:text-2xl" /> */}
          <BellDropdown/>
        </button>
        <button className="text-orange-500 hover:text-orange-600">
          <FiGrid className="text-lg md:text-2xl" />
        </button>
        <button className="text-orange-500 hover:text-orange-600">
          <FiHelpCircle className="text-lg md:text-2xl" />
        </button>
        <button className="flex items-center">
        <img 
  src={`http://localhost:6001${user?.profilePicture || "/placeholder.jpg"}`} 
  alt="Profile" 
  className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover" 
/>

        </button>
      </div>
    </nav>
  );
};

export default Navbar;
