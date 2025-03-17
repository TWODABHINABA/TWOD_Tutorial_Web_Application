import React, { useState } from "react";
import { MdLogin, MdLogout } from "react-icons/md";
import { FaUser } from "react-icons/fa";
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
  const isRoleAdmin = localStorage.getItem("role");
  return (
    <>
      {/* <div className="m-3 mt-4 top-bar">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-left justify-between">
            <div className="w-full md:w-3/4 flex flex-wrap">
              <span className="text-sm mr-3 flex items-center cursor-default text-orange-600">
                <span className="icon-question-circle-o mr-2"></span>
                <span className="hidden lg:inline-block">Have a question?</span>
              </span>
              <span className="text-sm mr-3 flex items-center cursor-default text-orange-600">
                <span className="icon-phone mr-2"></span>
                <span className="hidden lg:inline-block">10 20 123 456</span>
              </span>
              <span className="text-sm mr-3 flex items-center cursor-default text-orange-600">
                <span className="icon-envelope mr-2"></span>
                <span className="hidden lg:inline-block">info@mydomain.com</span>
              </span>
            </div> 
            <div className="w-full md:w-1/4 text-right mt-2 md:mt-0">
              {!isAuthenticated ? (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm mr-6 inline-flex items-center cursor-pointer bg-transparent border-none p-0 text-orange-500 hover:text-orange-600"
                  type="button"
                >
                  <span className="icon-lock mr-1">
                    <MdLogin />
                  </span>
                  Log In
                </button>
              ) : (
                <button onClick={handleLogout}>
                  <span className="border-2 border-orange-500 text-orange-500 px-3 py-2 rounded-md hover:bg-orange-500 hover:text-white transition-all flex icon-lock gap-2 mr-5 mt-4">
                    <MdLogout className="mt-1" />
                    Log Out
                  </span>
                </button>
              )}
              {isRoleAdmin === "admin" && (
                <AnimatedNavbarLink to="/add-course">
                  <button className="bg-green-500 text-white px-2 py-2 rounded cursor-pointer">
                    Add Course
                  </button>
                </AnimatedNavbarLink>
                
              )}
              {!isAuthenticated ? (
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="text-sm inline-flex items-center cursor-pointer bg-transparent border-none p-0 mr-6 text-orange-500 hover:text-orange-600"
                  type="button"
                >
                  <span className="icon-person mr-1">
                    <FaUser />
                  </span>
                  Register
                </button>
              ) : (
                <button></button>
              )}
            </div> 
          </div>
        </div>
      </div> */}

      <div className="h-[1px] bg-orange-400"></div>
      {/* <div className="sticky top-0 z-50 bg-orange-100 ">
        <Navbar fluid rounded>
          <NavbarBrand as={Link} to="/">
            <h1 className="mr-1 transition-transform duration-300 hover:scale-110">
              <TbSquareRoot className="text-4xl text-orange-600" />
            </h1>
            <span className="self-center whitespace-nowrap text-xl font-semibold text-orange-500">
              TUTOR
            </span>
          </NavbarBrand>
          <div className="flex md:order-2 items-center">
            <button className="mr-3 rounded-lg border-2 border-orange-500 px-4 py-2 font-semibold transition-colors hover:bg-orange-500 hover:text-white hover:border-orange-500"
            onClick={() => window.location.href = `/category/}`}>
              Get Started
            </button>
            <NavbarToggle />
          </div>
          <NavbarCollapse className="transition-all duration-300 ease-in-out text-xl">
            <AnimatedNavbarLink to="/" ignoreActive>
              <ExploreDropdown />
            </AnimatedNavbarLink>
            <AnimatedNavbarLink to="/resources">Resources &nbsp;&nbsp;</AnimatedNavbarLink>
            <AnimatedNavbarLink to="/pricing">Pricing &nbsp;&nbsp;</AnimatedNavbarLink>
            <AnimatedNavbarLink to="/about">About&nbsp;&nbsp;</AnimatedNavbarLink>
            <AnimatedNavbarLink to="/contact">Contact</AnimatedNavbarLink>
            {!isAuthenticated ? (
              <></>
            ) : (
              <AnimatedNavbarLink to="/user">UserInfo</AnimatedNavbarLink>
            )}
           {isRoleAdmin==="admin" ?(<AnimatedNavbarLink to="/add-tutor">Add Tutor</AnimatedNavbarLink>):(<></>)}

           {isRoleAdmin==="admin" ?(<AnimatedNavbarLink to="/add-availability">Add Tutor Availability</AnimatedNavbarLink>):(<></>)}
           
              {!isAuthenticated ? (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm mr-6 inline-flex items-center cursor-pointer bg-transparent border-none p-0 text-orange-500 hover:text-orange-600"
                  type="button"
                >
                  <span className="icon-lock mr-1">
                    <MdLogin />
                  </span>
                  Log In
                </button>
              ) : (
                <button onClick={handleLogout}>
                  <span className="border-2 border-orange-500 text-orange-500 px-3 py-2 rounded-md hover:bg-orange-500 hover:text-white transition-all flex icon-lock gap-2 mr-5 mt-4">
                    <MdLogout className="mt-1" />
                    Log Out
                  </span>
                </button>
              )}
              {isRoleAdmin === "admin" && (
                <AnimatedNavbarLink to="/add-course">
                  <button className="bg-green-500 text-white px-2 py-2 rounded cursor-pointer">
                    Add Course
                  </button>
                </AnimatedNavbarLink>
                
              )}
              {!isAuthenticated ? (
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="text-sm inline-flex items-center cursor-pointer bg-transparent border-none p-0 mr-6 text-orange-500 hover:text-orange-600"
                  type="button"
                >
                  <span className="icon-person mr-1">
                    <FaUser />
                  </span>
                  Register
                </button>
              ) : (
                <button></button>
              )}
            
          </NavbarCollapse>
        </Navbar>
      </div> */}

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

            {/* LEFT Links */}
            <div className="hidden md:flex gap-6 text-xl ml-20">
              <AnimatedNavbarLink to="/category/:categoryName" ignoreActive>
                <ExploreDropdown />
              </AnimatedNavbarLink>
              <AnimatedNavbarLink to="/resources">Resources</AnimatedNavbarLink>
              <AnimatedNavbarLink to="/pricing">Pricing</AnimatedNavbarLink>
              <AnimatedNavbarLink to="/about">About</AnimatedNavbarLink>
              <AnimatedNavbarLink to="/contact">Contact</AnimatedNavbarLink>
              {isAuthenticated && (
                <AnimatedNavbarLink to="/user">UserInfo</AnimatedNavbarLink>
              )}
              {isRoleAdmin === "admin" && (
                <>
                  <AnimatedNavbarLink to="/add-tutor">
                    Add Tutor
                  </AnimatedNavbarLink>
                  <AnimatedNavbarLink to="/add-availability">
                    Add Availability
                  </AnimatedNavbarLink>
                  <AnimatedNavbarLink to="/add-course">
                    <button className="bg-green-500 text-white px-2 py-2 rounded cursor-pointer">
                      Add Course
                    </button>
                  </AnimatedNavbarLink>

                  <AnimatedNavbarLink to="/add-session-time">
                    <button className="bg-green-500 text-white px-2 py-2 rounded cursor-pointer">
                      Add Session Time
                    </button>
                  </AnimatedNavbarLink>
                </>
              )}
            </div>
          </div>

          {/* RIGHT Side - Auth Buttons */}
          <div className="flex items-center gap-4 md:order-2">
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
              <button onClick={handleLogout}>
                <span className="border-2 border-orange-500 text-orange-500 px-3 py-2 rounded-md hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2">
                  <MdLogout />
                  Log Out
                </span>
              </button>
            )}
            {/* Get Started */}
            {/* <button
              className="rounded-lg border-2 border-orange-500 px-4 py-2 font-semibold transition-colors hover:bg-orange-500 hover:text-white"
              onClick={() => (window.location.href = `/category/`)}
            >
              Get Started
            </button> */}
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
