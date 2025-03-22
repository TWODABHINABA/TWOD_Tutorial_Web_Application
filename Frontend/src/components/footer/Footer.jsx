import React, { useEffect } from "react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const CustomFooter = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  useEffect(() => {
    // const isAuthenticated = localStorage.getItem("token");
  }, [isAuthenticated]);
  const isRoleAdmin = localStorage.getItem("role");
  console.log(isRoleAdmin);

  return (
    <footer className="bg-[#e89a55] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <div
              onClick={() => navigate("/")}
              className="text-2xl font-bold cursor-pointer font-serif text-white"
            >
              TUTOR
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-4 sm:gap-6">
            {isRoleAdmin==="admin" && (
              <div>
                <h3 className="text-lg font-semibold mb-2 uppercase text-white">
                  ADMIN CONTROL
                </h3>
                <ul>
                  <li className="mb-1">
                    <a
                      href="/add-tutor"
                      className="hover:text-[#D35400] text-white"
                    >
                      {" "}
                      Add Tutor
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="/add-session-time"
                      className="hover:text-[#D35400] text-white"
                    >
                      {" "}
                      Add Session Time
                    </a>
                  </li>

                  <li className="mb-1">
                    <a
                      href="/add-availability"
                      className="hover:text-[#D35400] text-white"
                    >
                      Add Availibility
                    </a>
                  </li>

                  <li className="mb-1">
                    <a
                      href="/add-course"
                      className="hover:text-[#D35400] text-white"
                    >
                      Add Course
                    </a>
                  </li>
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2 uppercase text-white">
                About
              </h3>
              <ul>
                <li className="mb-1">
                  <a href="#" className="hover:text-[#D35400] text-white">
                    TUTOR
                  </a>
                </li>
                <li className="mb-1">
                  <a href="#" className="hover:text-[#D35400] text-white">
                    Online Tutorials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 uppercase text-white">
                Follow us
              </h3>
              <ul>
                <li className="mb-1">
                  <a href="#" className="hover:text-[#D35400] text-white">
                    Github
                  </a>
                </li>
                <li className="mb-1">
                  <a href="#" className="hover:text-[#D35400] text-white">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 uppercase text-white">
                Legal
              </h3>
              <ul>
                <li className="mb-1">
                  <a href="#" className="hover:text-[#D35400] text-white">
                    Privacy Policy
                  </a>
                </li>
                <li className="mb-1">
                  <a href="#" className="hover:text-[#D35400] text-white">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-[#F5CBA7]" />

        <div className="flex flex-col sm:flex-row sm:justify-between items-center">
          <p className="text-sm text-white">
            &copy; 2025 TUTOR™. All Rights Reserved.
          </p>
          <div className="flex mt-4 sm:mt-0 space-x-6">
            <a href="#" className="text-white hover:text-[#D35400]">
              <BsFacebook size={20} />
            </a>
            <a href="#" className="text-white hover:text-[#D35400]">
              <BsInstagram size={20} />
            </a>
            <a href="#" className="text-white hover:text-[#D35400]">
              <BsTwitter size={20} />
            </a>
            <a href="#" className="text-white hover:text-[#D35400]">
              <BsGithub size={20} />
            </a>
            <a href="#" className="text-white hover:text-[#D35400]">
              <BsDribbble size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;
