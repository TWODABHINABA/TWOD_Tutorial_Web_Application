import React, { useEffect, useState } from "react";
import { MdLogin, MdLogout } from "react-icons/md";
import { FaGraduationCap, FaUser, FaUserTie } from "react-icons/fa";
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
import authLogout from "../useLogout/UseLogout";



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
  const {handleLogout}=authLogout();

  const isAuthenticated = localStorage.getItem("token");
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
              <AnimatedNavbarLink to="/about">Our Tutors</AnimatedNavbarLink>
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
            {isAuthenticated && (
              <AnimatedNavbarLink to="/purchased-course">
                <FaGraduationCap size={20} color="orange" title="Purchased Course" />
                
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
