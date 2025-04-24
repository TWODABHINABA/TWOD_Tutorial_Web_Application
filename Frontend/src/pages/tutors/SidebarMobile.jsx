import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Derive active label from the current path
  const getActiveLabel = (pathname) => {
    if (pathname.startsWith("/tutor-dashboard")) return "Dashboard";
    if (pathname.startsWith("/tutor-controls")) return "Controls";
    if (pathname.startsWith("/tutor-products")) return "Products";
    if (pathname.startsWith("/tutor-analytics")) return "Analytics";
    if (pathname.startsWith("/tutor-members")) return "Members";
    return "";
  };
  const active = getActiveLabel(location.pathname);
  const handleNav = (label, path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Hamburger button */}
      <button
        className="fixed top-4 left-4 z-50 flex h-5 w-5 flex-col justify-between focus:outline-none"
        onClick={() => setOpen(true)}
      >
        <span className="block h-1 w-full bg-orange-500" />
        <span className="block h-1 w-full bg-orange-500" />
        <span className="block h-1 w-full bg-orange-500" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64
          bg-white shadow-lg z-50 transform
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-orange-600">Menu</h2>
          <button
            className="text-2xl text-orange-500 focus:outline-none"
            onClick={() => setOpen(false)}
          >
            &times;
          </button>
        </div>

        {/* Nav Buttons */}
        <nav className="mt-4 flex flex-col space-y-1 px-2">
          <NavButton
            label="Dashboard"
            to="/tutor-dashboard"
            active={active === "Dashboard"}
            onClick={() => handleNav("Dashboard", "/tutor-dashboard")}
          />
          <NavButton
            label="Controls"
            to="/tutor-controls"
            active={active === "Controls"}
            onClick={() => handleNav("Controls", "/tutor-controls")}
          />
          <NavButton
            label="Products"
            to="/tutor-products"
            active={active === "Products"}
            onClick={() => handleNav("Products", "/tutor-products")}
          />
          <NavButton
            label="Analytics"
            to="/tutor-analytics"
            active={active === "Analytics"}
            onClick={() => handleNav("Analytics", "/tutor-analytics")}
          />
          <NavButton
            label="Assignment"
            to="/tutor-assignment"
            active={active === "Assignment"}
            onClick={() => handleNav("Assignment", "/tutor-assignment")}
          />
        </nav>
      </div>
    </div>
  );
}

function NavButton({ label, to, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex w-full items-center rounded-md px-4 py-2 text-left text-sm font-medium
        transition-colors
        ${active
          ? "bg-orange-400 text-white"
          : "text-orange-600 hover:bg-orange-100 hover:text-orange-800"
        }
      `}
    >
      {label}
    </button>
  );
}
