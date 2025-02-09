import React, { useState } from "react";
import { MdLogin } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { TbSquareRoot } from "react-icons/tb";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from "flowbite-react";
import Modal from "../../pages/login_signup/Modal"; 
import ExploreDropdown from "../exploredropdown/ExploreDropdown";
const AnimatedNavbarLink = ({ children, to, ignoreActive = false }) => {
  const location = useLocation();
  const isActive = !ignoreActive && location.pathname === to;
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative block md:inline-block text-black text-base ${isActive ? "font-bold" : ""} transition-colors duration-300`}
    >
      {children}
      <span
        style={{ transform: hovered ? "scaleX(1)" : "scaleX(0)" }}
        className="absolute left-0 right-0 -bottom-1 h-0.5 bg-indigo-300 transition-transform duration-300 ease-out origin-left"
      />
    </Link>
  );
};

const CustomNavbar = () => {
<<<<<<< HEAD
    const navigate = useNavigate();
  return (
    <div>
        <div className="m-3  mt-4 top-bar">
  <div className="container mx-auto px-4">
    <div className="flex flex-wrap items-center justify-between">
      <div className="w-1/2 lg:w-3/4 flex">
        <a href="#" className="text-sm mr-3 flex items-center">
          <span className="icon-question-circle-o mr-2"></span>
          <span className="hidden lg:inline-block">Have a question?</span>
        </a>
        <a href="#" className="text-sm mr-3 flex items-center">
          <span className="icon-phone mr-2"></span>
          <span className="hidden lg:inline-block">10 20 123 456</span>
        </a>
        <a href="#" className="text-sm mr-3 flex items-center">
          <span className="icon-envelope mr-2"></span>
          <span className="hidden lg:inline-block">info@mydomain.com</span>
        </a>
      </div>
      <div className="w-1/2 lg:w-1/4 text-right ">
        <a  onClick={() => navigate("/login")} className="text-sm mr-6 inline-flex items-center ">
          <span className="icon-lock mr-1"><MdLogin /></span> Log In
        </a>
        <a onClick={()=> navigate("/register")} className="text-sm inline-flex items-center">
          <span className="icon-person mr-1"><FaUser /></span> Register
        </a>
      </div>
    </div>
  </div>
</div>
=======
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
>>>>>>> 6a115f04063c5da386039160130617b85725717a

  return (
    <>
      <div className="m-3 mt-4 top-bar">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-3/4 flex flex-wrap">
              <span className="text-sm mr-3 flex items-center cursor-default">
                <span className="icon-question-circle-o mr-2"></span>
                <span className="hidden lg:inline-block">Have a question?</span>
              </span>
              <span className="text-sm mr-3 flex items-center cursor-default">
                <span className="icon-phone mr-2"></span>
                <span className="hidden lg:inline-block">10 20 123 456</span>
              </span>
              <span className="text-sm mr-3 flex items-center cursor-default">
                <span className="icon-envelope mr-2"></span>
                <span className="hidden lg:inline-block">info@mydomain.com</span>
              </span>
            </div>
            <div className="w-full md:w-1/4 text-right mt-2 md:mt-0">
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-sm mr-6 inline-flex items-center cursor-pointer bg-transparent border-none p-0"
                type="button"
              >
                <span className="icon-lock mr-1">
                  <MdLogin />
                </span>
                Log In
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="text-sm inline-flex items-center cursor-pointer bg-transparent border-none p-0"
                type="button"
              >
                <span className="icon-person mr-1">
                  <FaUser />
                </span>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-slate-400"></div>
      <div className="sticky top-0 z-50 bg-white">
        <Navbar fluid rounded>
          <NavbarBrand as={Link} to="/">
            <h1 className="mr-1 transition-transform duration-300 hover:scale-110">
              <TbSquareRoot className="text-4xl" />
            </h1>
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              TUTOR
            </span>
          </NavbarBrand>
          <div className="flex md:order-2 items-center">
            <button className="mr-3 rounded-lg border-2 border-indigo-600 px-4 py-2 font-semibold transition-colors hover:bg-indigo-500 hover:text-white hover:border-indigo-500">
              Get Started
            </button>
            <NavbarToggle />
          </div>
          <NavbarCollapse className="transition-all duration-300 ease-in-out text-xl">
            <AnimatedNavbarLink to="/" ignoreActive>
              <ExploreDropdown />
            </AnimatedNavbarLink>
            <AnimatedNavbarLink to="/resources">Resources</AnimatedNavbarLink>
            <AnimatedNavbarLink to="/services">Services</AnimatedNavbarLink>
            <AnimatedNavbarLink to="/pricing">Pricing</AnimatedNavbarLink>
            <AnimatedNavbarLink to="/about">About</AnimatedNavbarLink>
            <AnimatedNavbarLink to="/contact">Contact</AnimatedNavbarLink>
          </NavbarCollapse>
        </Navbar>
      </div>

      {showRegisterModal && (
        <Modal initialAction="Sign Up" onClose={() => setShowRegisterModal(false)} />
      )}
      {showLoginModal && (
        <Modal initialAction="Login" onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};

export default CustomNavbar;
