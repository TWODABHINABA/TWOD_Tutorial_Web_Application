import React from 'react';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const CustomFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <div 
              onClick={() => navigate("/")} 
              className="text-2xl font-bold cursor-pointer font-serif text-black"
            >
              TUTOR
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 uppercase">About</h3>
              <ul>
                <li className="mb-1">
                  <a href="#" className="hover:underline text-gray-700">TUTOR</a>
                </li>
                <li className="mb-1">
                  <a href="#" className="hover:underline text-gray-700">Online Tutorials</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 uppercase">Follow us</h3>
              <ul>
                <li className="mb-1">
                  <a href="#" className="hover:underline text-gray-700">Github</a>
                </li>
                <li className="mb-1">
                  <a href="#" className="hover:underline text-gray-700">Discord</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 uppercase">Legal</h3>
              <ul>
                <li className="mb-1">
                  <a href="#" className="hover:underline text-gray-700">Privacy Policy</a>
                </li>
                <li className="mb-1">
                  <a href="#" className="hover:underline text-gray-700">Terms &amp; Conditions</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-300" />

        <div className="flex flex-col sm:flex-row sm:justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; 2025 TUTOR™. All Rights Reserved.
          </p>
          <div className="flex mt-4 sm:mt-0 space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <BsFacebook size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <BsInstagram size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <BsTwitter size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <BsGithub size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <BsDribbble size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;
