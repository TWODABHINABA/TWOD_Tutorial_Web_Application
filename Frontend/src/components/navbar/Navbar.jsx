import React, { useState, useRef } from "react";
import { MdLogin, MdLogout, MdSearch, MdContactMail } from "react-icons/md";
import {
  FaGraduationCap,
  FaUser,
  FaUserTie,
  FaCompass,
  FaTags,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { TbSquareRoot } from "react-icons/tb";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Navbar, NavbarBrand } from "flowbite-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../../pages/login_signup/Modal";
import ExploreDropdown from "../exploredropdown/ExploreDropdown";
import SearchBar from "../search/SearchBar";
import authLogout from "../useLogout/UseLogout";
import CountrySelector from "../CountrySelector/CountrySelector";

const AnimatedNavbarLink = ({ children, to, ignoreActive = false }) => {
  const location = useLocation();
  const isActive = !ignoreActive && location.pathname === to;
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative block md:inline-block text-black text-base ${
        isActive ? "font-bold" : ""
      } transition-colors duration-300`}
    >
      {children}
      <span
        style={{ transform: hovered ? "scaleX(1)" : "scaleX(0)" }}
        className="absolute left-0 right-0 -bottom-1 h-0.5 bg-orange-400 transition-transform duration-300 ease-out origin-left"
      />
    </Link>
  );
};

const CustomNavbar = () => {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { handleLogout } = authLogout();
  const mobileSearchRef = useRef(null);

  const isAuthenticated = localStorage.getItem("token");

  return (
    <>
      {/* <div className="h-[1px] bg-orange-400"></div> */}

      <div className="sticky top-0 z-50 bg-orange-100">
        <Navbar fluid rounded className="bg-[#FAF3E0] ">
          {/* LEFT Side - Logo and Left Links */}
          <div className="flex items-center gap-8">
            <NavbarBrand as={Link} to="/">
              <h1 className="mr-1 transition-transform duration-300 hover:scale-110">
                <TbSquareRoot className="text-4xl text-orange-600" />
              </h1>
              <span className="self-center whitespace-nowrap text-xl font-semibold text-orange-500 max-sm:hidden">
                TUTOR
              </span>
            </NavbarBrand>

            {/* LEFT Links - Desktop View */}
            <div className="hidden md:flex gap-6 text-xl ml-20">
              <AnimatedNavbarLink to="/category/:categoryName" ignoreActive>
                <ExploreDropdown />
              </AnimatedNavbarLink>
              <AnimatedNavbarLink to="/pricing">Pricing</AnimatedNavbarLink>
              <AnimatedNavbarLink to="/about">Our Tutors</AnimatedNavbarLink>
              <AnimatedNavbarLink to="/contact">Contact</AnimatedNavbarLink>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:block">
              <SearchBar />
            </div>
          </div>

          {/* RIGHT Side - Auth Buttons and Mobile Search Icon */}
          <div className="flex items-center gap-4 md:order-2">
            <CountrySelector />
            
            {isAuthenticated && (
              <AnimatedNavbarLink to="/user">
                <FaUserTie size={20} color="orange" title="UserInfo" />
              </AnimatedNavbarLink>
            )}
            {isAuthenticated && (
              <AnimatedNavbarLink to="/purchased-course">
                <FaGraduationCap
                  size={20}
                  color="orange"
                  title="Purchased Course"
                />
              </AnimatedNavbarLink>
            )}
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm inline-flex items-center cursor-pointer bg-transparent border-none p-0 text-orange-500 hover:text-orange-600"
                  type="button"
                >
                  <MdLogin className="mr-1" />
                  Log In
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="text-sm inline-flex items-center cursor-pointer bg-transparent border-none p-0 text-orange-500 hover:text-orange-600"
                  type="button"
                >
                  <FaUser className="mr-1" />
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-sm inline-flex items-center cursor-pointer bg-transparent border-none p-0 text-orange-500 hover:text-orange-600"
                type="button"
              >
                <MdLogout className="mr-1" />
                Log out
              </button>
            )}

            {/* Mobile: Search Icon Button */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="md:hidden"
              type="button"
              aria-label="Toggle Mobile Search"
            >
              <MdSearch size={24} color="orange" />
            </button>
          </div>
        </Navbar>
        <div className="h-[2px] bg-orange-400 "></div>
      </div>

      {/* Mobile: Toggled Search Bar with Animation */}
      {showMobileSearch && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 top-14 left-3  justify-center"
            onClick={() => setShowMobileSearch(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={mobileSearchRef}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-2 rounded shadow-lg w-11/12 max-w-md "
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setShowMobileSearch(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                aria-label="Close Search"
              >
                ✕
              </button>
              <SearchBar />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Mobile: Sticky Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAF3E0]  shadow-t py-2 flex justify-around md:hidden z-50">
        <Link
          to="/category/:categoryName"
          className="flex flex-col items-center"
        >
          <FaCompass size={24} className="text-[#fb923c]" />
          <span className="text-xs font-bold text-[#fb923c]">Explore</span>
        </Link>
        <Link to="/pricing" className="flex flex-col items-center">
          <FaTags size={24} className="text-[#fb923c]" />
          <span className="text-xs font-bold text-[#fb923c]">Pricing</span>
        </Link>
        <Link to="/about" className="flex flex-col items-center">
          <FaChalkboardTeacher size={24} className="text-[#fb923c]" />
          <span className="text-xs font-bold text-[#fb923c]">Tutors</span>
        </Link>
        <Link to="/contact" className="flex flex-col items-center">
          <MdContactMail size={24} className="text-[#fb923c]" />
          <span className="text-xs font-bold text-[#fb923c]">Contact</span>
        </Link>
      </div>

      {showRegisterModal && (
        <Modal
          initialAction="Sign Up"
          onClose={() => setShowRegisterModal(false)}
        />
      )}
      {showLoginModal && (
        <Modal initialAction="Login" onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};

export default CustomNavbar;
