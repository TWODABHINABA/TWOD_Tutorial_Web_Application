import React, { useEffect, useState } from "react";
import { MdLogin, MdLogout } from "react-icons/md";
import { FaUser, FaUserTie } from "react-icons/fa";
import { TbSquareRoot } from "react-icons/tb";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import Modal from "../../pages/login_signup/Modal";
import ExploreDropdown from "../exploredropdown/ExploreDropdown";
import SearchBar from "../search/SearchBar";
import { FaUserGraduate } from "react-icons/fa";

// Logout function remains in the code but its UI option has been removed.
const handleLogout = async (e) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/";
};

const AnimatedNavbarLink = ({ children, to, ignoreActive = false }) => {
  const location = useLocation();
  const isActive = !ignoreActive && location.pathname === to;
  const [hovered, setHovered] = useState(false);

  return (
    // <Link
    //   to={to}
    //   onMouseEnter={() => setHovered(true)}
    //   onMouseLeave={() => setHovered(false)}
    //   className={`relative block md:inline-block text-black text-base ${
    //     isActive ? "font-bold" : ""
    //   } transition-colors duration-300`}
    // >
    //   {children}
    //   <span
    //     style={{ transform: hovered ? "scaleX(1)" : "scaleX(0)" }}
    //     className="absolute left-0 right-0 -bottom-1 h-0.5 bg-orange-400 transition-transform duration-300 ease-out origin-left"
    //   />
    // </Link>

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

  const isAuthenticated = localStorage.getItem("token");
  useEffect(() => {
    // const isAuthenticated = localStorage.getItem("token");
  }, [isAuthenticated]);
  const isRoleAdmin = localStorage.getItem("role");
  return (
    <>
      <div className="h-[1px] bg-orange-400"></div>

      <div className="sticky top-0 z-50 bg-orange-100">
        <Navbar fluid rounded>
          {/* LEFT Side - Logo and Left Links */}
          <div className="flex items-center gap-8">
            <NavbarBrand as={Link} to="/">
              <h1 className="mr-1 transition-transform duration-300 hover:scale-110">
                <TbSquareRoot className="text-4xl text-orange-600" />
              </h1>
              <span className="self-center whitespace-nowrap text-xl font-semibold text-orange-500">
                TUTOR
              </span>
            </NavbarBrand>

            {/* SearchBar inside Navbar */}

            {/* LEFT Links */}
            <div className="hidden md:flex gap-6 text-xl ml-20">
              <AnimatedNavbarLink to="/category/:categoryName" ignoreActive>
                <ExploreDropdown />
              </AnimatedNavbarLink>
              <AnimatedNavbarLink to="/pricing">Pricing</AnimatedNavbarLink>
              <AnimatedNavbarLink to="/about">About</AnimatedNavbarLink>
              <AnimatedNavbarLink to="/contact">Contact</AnimatedNavbarLink>
            </div>
            <div className=" ">
              <SearchBar />
            </div>
          </div>

          {/* RIGHT Side - Auth Buttons */}
          <div className="flex items-center gap-4 md:order-2">
            {isAuthenticated && (
              <AnimatedNavbarLink to="/user">
                <FaUserTie size={20} color="orange" title="UserInfo" />
              </AnimatedNavbarLink>
            )}
            {/* {isRoleAdmin === "admin" && (
              <>
                <AnimatedNavbarLink to="/add-tutor">
                  Add Tutor
                </AnimatedNavbarLink>
                <AnimatedNavbarLink to="/add-availability">
                  Add Availability
                </AnimatedNavbarLink>
                <AnimatedNavbarLink to="/add-course">
                  Add Course
                </AnimatedNavbarLink>
                <AnimatedNavbarLink to="/add-session-time">
                  Add Session Time
                </AnimatedNavbarLink>
              </>
            )} */}
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
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-sm inline-flex items-center cursor-pointer bg-transparent border-none p-0 text-orange-500 hover:text-orange-600"
                type="button"
              >
                <MdLogin className="mr-1" />
                Log out
              </button>
            )}

            {/* Mobile Toggle */}
            <NavbarToggle />
          </div>
        </Navbar>
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
