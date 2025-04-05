// src/components/footer/PaymentFooter.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaLock,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaQuestionCircle,
} from "react-icons/fa";

const PaymentFooter = () => {
  return (
    <footer className="bg-[#e89a55] py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Help Link */}
        <div className="flex items-center space-x-2">
          <FaQuestionCircle className="text-white" />
          <Link
            to="/help"
            className="text-white hover:text-[#D35400] font-medium"
          >
            Help
          </Link>
        </div>

        {/* Legal Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link
            to="/terms"
            className="text-white hover:text-[#D35400]"
          >
            Terms of Service
          </Link>
          <Link
            to="/privacy"
            className="text-white hover:text-[#D35400]"
          >
            Privacy Policy
          </Link>
          <Link
            to="/security"
            className="flex items-center text-white hover:text-[#D35400]"
          >
            <FaLock className="mr-1" /> Security
          </Link>
        </div>

        {/* Payment Icons */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <FaCcVisa size={36} className="text-white hover:text-[#D35400]" />
          <FaCcMastercard size={36} className="text-white hover:text-[#D35400]" />
          <FaCcPaypal size={36} className="text-white hover:text-[#D35400]" />
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-[#F5CBA7]" />

      {/* Copyright */}
      <div className="text-center text-sm text-white">
        © {new Date().getFullYear()} TUTOR™. All Rights Reserved.
      </div>
    </footer>
  );
};

export default PaymentFooter;
