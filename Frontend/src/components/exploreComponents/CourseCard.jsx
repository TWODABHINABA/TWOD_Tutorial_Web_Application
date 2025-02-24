import React, { useRef } from "react";
import { motion } from "framer-motion";

// Static data based on your course schema
const coursesData = [
  {
    courseType: "Pro",
    name: "React Basics",
    overview: "Learn the fundamentals of React with hands-on examples.",
    description: "This course covers component structure, state management, and hooks.",
    price: "$299",
    discountPrice: "$249",
    duration: "4 weeks",
    instructor: "John Doe",
    level: "Beginner",
  },
  {
    courseType: "Pro",
    name: "Node.js Mastery",
    overview: "Deep dive into server-side development with Node.js.",
    description: "Understand asynchronous programming, Express, and MongoDB integration.",
    price: "$399",
    discountPrice: "$349",
    duration: "6 weeks",
    instructor: "Jane Smith",
    level: "Intermediate",
  },
  {
    courseType: "Basic",
    name: "JavaScript Essentials",
    overview: "Master the basics of JavaScript to build dynamic websites.",
    description: "Covers variables, functions, and DOM manipulation.",
    price: "$199",
    discountPrice: "$179",
    duration: "3 weeks",
    instructor: "Emily Johnson",
    level: "Beginner",
  },
  {
    courseType: "Basic",
    name: "JavaScript Essentials",
    overview: "Master the basics of JavaScript to build dynamic websites.",
    description: "Covers variables, functions, and DOM manipulation.",
    price: "$199",
    discountPrice: "$179",
    duration: "3 weeks",
    instructor: "Emily Johnson",
    level: "Beginner",
  },
  // Add more course objects as needed
];

const Card = ({ course }) => {
  return (
    <motion.div
      whileHover="hover"
      transition={{ duration: 0.5, ease: "easeInOut" }}
      variants={{ hover: { scale: 1.03 } }}
      className="relative h-96 w-80 shrink-0 overflow-hidden rounded-xl bg-white shadow-lg p-8 mr-4"
    >
      <div className="relative z-10 text-[#6366F1]">
        <span className="mb-3 block w-fit rounded-full bg-blue-100 px-3 py-0.5 text-sm font-light text-blue-600">
          {course.courseType}
        </span>
        <motion.span
          initial={{ scale: 0.95 }}
          variants={{ hover: { scale: 1 } }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="my-2 block font-sans text-2xl font-bold leading-tight"
        >
          {course.name}
        </motion.span>
        <p className="text-sm text-gray-700">{course.overview}</p>
        {/* Pricing Section */}
        <div className="mt-4">
          <span className="text-xl font-bold text-red-500">
            {course.discountPrice}
          </span>
          <span className="text-sm text-black line-through ml-2">
            {course.price}
          </span>
        </div>
        {/* Duration Section */}
        <p className="mt-2 text-xs text-gray-500">
          Duration: {course.duration}
        </p>
      </div>
      <button className="absolute bottom-4 left-4 right-4 z-20 rounded bg-[#6366F1] hover:bg-indigo-700 py-2 text-center font-sans font-semibold uppercase text-white transition-colors">
        Get it now
      </button>
      <Background />
    </motion.div>
  );
};

const Background = () => {
  return (
    <motion.svg
      width="320"
      height="384"
      viewBox="0 0 320 384"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 z-0"
      variants={{ hover: { scale: 1.5 } }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.circle
        cx="160.5"
        cy="114.5"
        r="101.5"
        fill="#eceef2"
        variants={{ hover: { scaleY: 0.5, y: -15 } }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
      />
      <motion.ellipse
        cx="160.5"
        cy="265.5"
        rx="101.5"
        ry="43.5"
        fill="#eceef2"
        variants={{ hover: { scaleY: 2.0, y: -15 } }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
      />
    </motion.svg>
  );
};

const CardCarousel = () => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="relative px-4 py-12 bg-gray-100">
      {/* Left Arrow */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30">
        <button
          onClick={scrollLeft}
          className="bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300"
        >
          &larr;
        </button>
      </div>
      {/* Right Arrow */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30">
        <button
          onClick={scrollRight}
          className="bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300"
        >
          &rarr;
        </button>
      </div>
      {/* Cards Container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {coursesData.map((course, index) => (
          <Card key={index} course={course} />
        ))}
      </div>
      {/* Global CSS to hide scrollbar for WebKit browsers */}
      <style jsx global>{`
        .flex::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default CardCarousel;
