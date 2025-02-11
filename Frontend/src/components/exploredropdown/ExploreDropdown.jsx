import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Top-level Explore link with its flyout
const Explore = () => {
  return (
    <div className="flex justify-center absolute top-1/2 transform -translate-x-[90%] -translate-y-1/2 text-base">
      {/* Remove arrow indicator on Explore by passing showArrow={false} */}
      <FlyoutLink FlyoutContent={PricingContent} showArrow={false}>
        Explore
      </FlyoutLink>
    </div>
  );
};

// Reusable FlyoutLink component that handles flyout positioning and arrow animation
const FlyoutLink = ({
  children,
  FlyoutContent,
  direction = "down",
  showArrow = true,
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const showFlyout = FlyoutContent && open;
  const isActive = location.pathname === "/" && !open;

  // Positioning based on the direction
  const flyoutPositionClasses =
    direction === "right" ? "absolute left-full top-0" : "absolute left-1/2 top-12";
  const flyoutTransformStyle =
    direction === "right" ? {} : { translateX: "-50%" };

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative w-fit h-fit"
    >
      <button
        type="button"
        className={`relative flex items-center text-black transition-colors duration-300 bg-transparent border-none ${
          isActive ? "font-bold" : ""
        }`}
      >
        {children}
        {/* Render arrow indicator only if FlyoutContent exists and showArrow is true */}
        {FlyoutContent && showArrow && (
          <span
            className={`inline-block ml-1 transition-transform duration-300 transform ${
              open ? "rotate-90" : "rotate-0"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        )}
        {/* Underline effect */}
        <span
          style={{ transform: showFlyout ? "scaleX(1)" : "scaleX(0)" }}
          className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left rounded-full bg-indigo-300 transition-transform duration-300 ease-out"
        />
      </button>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{
              opacity: 0,
              ...(direction === "right" ? { x: 15 } : { y: 15 }),
            }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{
              opacity: 0,
              ...(direction === "right" ? { x: 15 } : { y: 15 }),
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`${flyoutPositionClasses} bg-white text-black z-10`}
            style={flyoutTransformStyle}
          >
            {/* Popover arrow “nub” */}
            {direction === "right" ? (
              <>
                <div className="absolute -left-6 top-0 bottom-0 w-6 bg-transparent" />
                <div className="absolute top-1/2 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
              </>
            ) : (
              <>
                <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
                <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
              </>
            )}
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// High School flyout content
const HighSchool = () => {
  return (
    <div className="w-48 bg-white p-6 shadow-xl absolute">
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        English
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Maths
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Science
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Biology
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Social
      </button>
    </div>
  );
};

// New MPC subjects drop-right content
const MPCSubjects = () => {
  return (
    <div className="w-48 bg-white p-6 shadow-xl absolute">
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Mathematics
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Physics
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Chemistry
      </button>
    </div>
  );
};

// New BiPC subjects drop-right content
const BiPCSubjects = () => {
  return (
    <div className="w-48 bg-white p-6 shadow-xl absolute">
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Biology
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Physics
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Chemistry
      </button>
    </div>
  );
};

// Senior Secondary now contains nested flyouts for MPC and BiPC with space between them
const SeniorSecondary = () => {
  return (
    <div className="w-48 bg-white p-6 shadow-xl absolute space-y-2">
      <FlyoutLink FlyoutContent={MPCSubjects} direction="right">
        MPC
      </FlyoutLink>
      <FlyoutLink FlyoutContent={BiPCSubjects} direction="right">
        BiPC
      </FlyoutLink>
    </div>
  );
};

// Undergraduate flyout content
const Undergraduate = () => {
  return (
    <div className="w-72 bg-white p-6 shadow-xl absolute">
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Bachelor of Technology (B.Tech)
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Bachelor of Science (BSc)
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Bachelor of Arts (BA)
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Bachelor of Commerce (BCom)
      </button>
    </div>
  );
};

// Other flyout contents
const AIML = () => {
  return (
    <div className="w-52 bg-white p-6 shadow-xl absolute">
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Artificial Intelligence
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Machine Learning
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Deep Learning
      </button>
    </div>
  );
};

const WebDevelopment = () => {
  return (
    <div className="w-48 bg-white p-6 shadow-xl absolute">
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        HTML
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        CSS
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        JavaScript
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        ReactJs
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        NodeJs
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        MongoDB
      </button>
    </div>
  );
};

const Programming = () => {
  return (
    <div className="w-48 bg-white p-6 shadow-xl absolute">
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        C
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        C++
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        JAVA
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Python
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        PHP
      </button>
      <button
        type="button"
        className="block text-sm hover:underline p-2 bg-transparent border-none"
      >
        Rust
      </button>
    </div>
  );
};

// Main PricingContent flyout
const PricingContent = () => {
  return (
    <div className="w-64 bg-white p-6 shadow-xl">
      <div className="mb-3 space-y-3">
        <FlyoutLink FlyoutContent={HighSchool} direction="right">
          High School
        </FlyoutLink>
        <FlyoutLink FlyoutContent={SeniorSecondary} direction="right">
          Senior Secondary
        </FlyoutLink>
      </div>
      <div className="mb-6 space-y-3">
        <FlyoutLink FlyoutContent={Undergraduate} direction="right">
          Undergraduate
        </FlyoutLink>
        <FlyoutLink FlyoutContent={AIML} direction="right">
          AI & ML
        </FlyoutLink>
        <FlyoutLink FlyoutContent={WebDevelopment} direction="right" onClick>
          Web Development
        </FlyoutLink>
        <FlyoutLink FlyoutContent={Programming} direction="right">
          Programming
        </FlyoutLink>
      </div>
      <button className="w-full rounded-lg border-2 border-neutral-950 px-4 py-2 font-semibold transition-colors hover:bg-neutral-950 hover:text-white">
        Contact sales
      </button>
    </div>
  );
};

export default Explore;
