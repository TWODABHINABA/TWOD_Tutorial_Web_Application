import React from "react";
import { TbSquareRoot } from "react-icons/tb";
import { Navbar, NavbarBrand } from "flowbite-react";
import { Link } from "react-router-dom";

const CustomNavbar = () => {
  return (
    <div className="sticky top-0 z-50 bg-orange-100">
      <Navbar fluid rounded className="bg-[#FAF3E0] relative h-16">
        {/* Left: Logo */}
        <div className="flex items-center">
          <NavbarBrand as={Link} to="/">
            <h1 className="mr-1 transition-transform duration-300 hover:scale-110">
              <TbSquareRoot className="text-4xl text-orange-600" />
            </h1>
            <span className="self-center whitespace-nowrap text-xl font-semibold text-orange-500 max-sm:hidden ">
              TUTOR
            </span>
          </NavbarBrand>
        </div>

        {/* Center: Course Summary */}
        <div className="absolute left-[30%] text-center text-2xl font-bold text-orange-500 sm:hidden">
          Course Summary
        </div>
      </Navbar>
      <div className="h-[2px] bg-orange-400" />
    </div>
  );
};

export default CustomNavbar;
