import React from "react";
import { MdLogin } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { TbSquareRoot } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  NavbarLink,
  Button,
} from "flowbite-react";
import { Navigate } from "react-router-dom";

const CustomNavbar = () => {
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
        <a  onClick={() => navigate("/login")} className="text-sm mr-6 inline-flex items-center cursor-pointer">
          <span className="icon-lock mr-1"><MdLogin /></span> Log In
        </a>
        <a onClick={()=>navigate("/register")} className="text-sm inline-flex items-center cursor-pointer">
          <span className="icon-person mr-1"><FaUser /></span> Register
        </a>
      </div>
    </div>
  </div>
</div>

        <div className="h-[1px] bg-slate-400"></div>
    <Navbar fluid rounded>
      <NavbarBrand href="https://flowbite-react.com">
      <h1 className="mr-1 transition-transform duration-300 hover:scale-110 "><TbSquareRoot className="text-4xl"/>
      </h1>
        
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            
        TUTOR
        </span>
      </NavbarBrand>
      <div className="flex md:order-2 items-center">
        <Button className="transition-colors duration-300 hover:bg-blue-700">
          Get started
        </Button>
        <NavbarToggle />
      </div>
      <NavbarCollapse className="transition-all duration-300 ease-in-out">
        <NavbarLink
          href="#"
          active
          className="transition-colors duration-300 hover:text-blue-500"
        >
          Explore
        </NavbarLink>
        <NavbarLink
          href="#"
          className="transition-colors duration-300 hover:text-blue-500"
        >
          Resources
        </NavbarLink>
        <NavbarLink
          href="#"
          className="transition-colors duration-300 hover:text-blue-500"
        >
          Services
        </NavbarLink>
        <NavbarLink
          href="#"
          className="transition-colors duration-300 hover:text-blue-500"
        >
          Pricing
        </NavbarLink>
        <NavbarLink
          href="#"
          className="transition-colors duration-300 hover:text-blue-500"
        >
          About
        </NavbarLink>
        <NavbarLink
          href="#"
          className="transition-colors duration-300 hover:text-blue-500"
        >
          Contact
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
    </div>
  );
};

export default CustomNavbar;
