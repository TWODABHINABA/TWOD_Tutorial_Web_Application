import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../components/User-management/api"; 

// const fetchCourseId = async (courseName) => {
//   try {
//     const response = await api.get(`/courses?name=${encodeURIComponent(courseName)}`);
//     return response.data._id;
//   } catch (error) {
//     console.error("Error fetching course ID:", error);
//   }
// };

const fetchCourseId = async (courseName, courseType) => {
  try {
    const response = await api.get(
      `/courses?name=${encodeURIComponent(courseName)}&courseType=${encodeURIComponent(courseType)}`
    );
    return response.data._id;
  } catch (error) {
    console.error("Error fetching course ID:", error);
  }
};

// const Card = ({ course }) => {
//   return (
//     <motion.div
//       whileHover="hover"
//       transition={{ duration: 0.5, ease: "easeInOut" }}
//       variants={{ hover: { scale: 1.03 } }}
//       className="relative h-96 w-80 shrink-0 overflow-hidden rounded-xl bg-white shadow-lg p-8 mr-4 cursor-pointer"
//       onClick={async (e) => {
//         e.preventDefault();
//         const id = await fetchCourseId(course.name);
//         if (id) window.location.href = `/courses/${id}`;
//       }}
//     >
//       <div className="relative z-10 text-orange-400">
//         <span className="mb-3 block w-fit rounded-full bg-blue-100 px-3 py-0.5 text-sm font-light text-green-500">
//           {course.courseType}
//         </span>
//         <motion.span
//           initial={{ scale: 0.95 }}
//           variants={{ hover: { scale: 1 } }}
//           transition={{ duration: 0.5, ease: "easeInOut" }}
//           className="my-2 block font-sans text-2xl font-bold leading-tight"
//         >
//           {course.name}
//         </motion.span>
//         <p className="text-sm text-gray-700">{course.overview}</p>
//         <div className="mt-4">
//           <span className="text-xl font-bold text-violet-500">
//             ${course.discountPrice}
//           </span>
//           <span className="text-sm text-black line-through ml-2">
//             ${course.price}
//           </span>
//         </div>
//         <p className="mt-2 text-xs text-gray-500">
//           Duration: {course.duration}
//         </p>
//       </div>
//       <button
//         onClick={async (e) => {
//           e.preventDefault();
//           const id = await fetchCourseId(course.name);
//           if (id) window.location.href = `/courses/${id}`;
//         }}
//         className="absolute bottom-4 left-4 right-4 z-20 rounded bg-orange-400 hover:bg-orange-500 py-2 text-center font-sans font-semibold uppercase text-white transition-colors"
//       >
//         View Course
//       </button>
//       <Background/>
//     </motion.div>
//   );
// };


const Card = ({ course }) => {
  const handleCourseClick = async (e) => {
    e.preventDefault();
    const id = await fetchCourseId(course.name, course.courseType); 
    if (id) window.location.href = `/courses/${id}`;
  };

  return (
    <motion.div
      whileHover="hover"
      transition={{ duration: 0.5, ease: "easeInOut" }}
      variants={{ hover: { scale: 1.03 } }}
      className="relative h-96 w-80 shrink-0 overflow-hidden rounded-xl bg-white shadow-lg p-8 mr-4 cursor-pointer"
      onClick={handleCourseClick}
    >
      <div className="relative z-10 text-orange-400">
        <span className="mb-3 block w-fit rounded-full bg-blue-100 px-3 py-0.5 text-sm font-light text-green-500">
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
        <div className="mt-4">
          <span className="text-xl font-bold text-violet-500">
            ${course.discountPrice}
          </span>
          <span className="text-sm text-black line-through ml-2">
            ${course.price}
          </span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Duration: {course.duration}
        </p>
      </div>
      <button
        onClick={handleCourseClick}
        className="absolute bottom-4 left-4 right-4 z-20 rounded bg-orange-400 hover:bg-orange-500 py-2 text-center font-sans font-semibold uppercase text-white transition-colors"
      >
        View Course
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
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/allCourses", {
          withCredentials: true,
        });
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

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
    <section className="relative px-4 py-12 bg-[#FAF3E0]">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30">
        <button
          onClick={scrollLeft}
          className="bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300"
        >
          &larr;
        </button>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30">
        <button
          onClick={scrollRight}
          className="bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300"
        >
          &rarr;
        </button>
      </div>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 "
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {courses.length > 0 ? (
          courses.map((course, index) => <Card key={index} course={course} />)
        ) : (
          <p className="text-center text-gray-700 w-full">
            No courses available
          </p>
        )}
      </div>
      <style jsx global>{`
        .flex::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default CardCarousel;
