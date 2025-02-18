// src/Explore.jsx
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import api from "../User-management/api";

// ----- Dynamic Data -----
// const categoriesData = [
//   {
//     name: "High School",
//     courses: ["English", "Maths", "Science", "Biology", "Social"],
//   },
//   {
//     name: "Senior Secondary",
//     courses: ["MPC", "BiPC"],
//   },
//   {
//     name: "Undergraduate",
//     courses: [
//       "Bachelor of Technology (B.Tech)",
//       "Bachelor of Science (BSc)",
//       "Bachelor of Commerce (BCom)",
//     ],
//   },
//   {
//     name: "AI & ML",
//     courses: ["Artificial Intelligence", "Machine Learning", "Deep Learning"],
//   },
//   {
//     name: "Web Development",
//     courses: ["HTML", "CSS", "JavaScript", "React", "NodeJs", "MongoDB"],
//   },
//   {
//     name: "Programming",
//     courses: ["C", "C++", "JAVA", "Python", "PHP", "Rust"],
//   },
// ];
const fetchCategories = async () => {
  try {
    const response = await api.get("/categories");
    // console.log(response.data);  // API call to backend
    return response.data; // Expected format: [{ name: "Web Development", courses: ["React", "NodeJs"] }]
    
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const fetchCourseId = async (course) => {
  try {
    const response = await api.get(`/courses?name=${course}`);
    return response.data._id; // Ensure backend returns course._id
  } catch (error) {
    console.error("Error fetching course ID:", error);
  }
};

// ----- Reusable FlyoutLink Component -----
// Now with an optional href prop.
const FlyoutLink = ({
  children,
  FlyoutContent,
  direction = "down",
  showArrow = true,
  href, // if provided, clicking the main link navigates to this route
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const showFlyout = FlyoutContent && open;
  const isActive = location.pathname === (href || "/") && !open;

  const flyoutPositionClasses =
    direction === "right"
      ? "absolute left-full top-0"
      : "absolute left-1/2 top-12";
  const flyoutTransformStyle =
    direction === "right" ? {} : { translateX: "-50%" };

  const linkContent = (
    <div className="relative flex items-center transition-colors duration-300 bg-transparent border-none px-2 py-1">
      {children}
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
      <span
        style={{ transform: showFlyout ? "scaleX(1)" : "scaleX(0)" }}
        className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left rounded-full bg-indigo-300 transition-transform duration-300 ease-out"
      />
    </div>
  );

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative w-fit h-fit"
    >
      {href ? (
        <Link to={href} className="block">
          {linkContent}
        </Link>
      ) : (
        <button type="button" className="block">
          {linkContent}
        </button>
      )}
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
            className={`${flyoutPositionClasses} bg-white text-black z-10 p-4`}
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

const DynamicCategoryFlyout = ({ category }) => {
  return (
    <div className="w-48 bg-white p-6 shadow-xl absolute">
      {category.courses.map((course) => (
        <Link
          key={course}
          to="#"
          onClick={async (e) => {
            e.preventDefault();
            const id = await fetchCourseId(course);
            if (id) window.location.href = `/courses/${id}`;
          }}
          className="block text-sm hover:underline p-2"
        >
          {course}
        </Link>
      ))}
    </div>
  );
};

// ----- Main Dropdown (Displays Categories) -----
const PricingContent = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <div className="w-64 bg-white p-6 shadow-xl">
      {categories.length > 0 ? (
        categories.map((cat) => (
          <FlyoutLink
            key={cat.name}
            href={`/category/${encodeURIComponent(cat.name)}`}
            FlyoutContent={() => <DynamicCategoryFlyout category={cat} />}
            direction="right"
          >
            {cat.name}
          </FlyoutLink>
        ))
      ) : (
        <p>No categories found</p>
      )}
    </div>
  );
};

// ----- Explore Dropdown Component -----
const Explore = () => {
  return (
    <div className="flex justify-center absolute top-1/2 transform -translate-x-[90%] -translate-y-1/2 text-base p-4">
      <FlyoutLink FlyoutContent={PricingContent} showArrow={false}>
        Explore
      </FlyoutLink>
    </div>
  );
};

export default Explore;

// // ----- Components for MPC and BiPC Nested Flyouts -----
// const MPCSubjects = () => {
//   return (
//     <div className="w-48 bg-white p-6 shadow-xl absolute">
//       <Link
//         to="/course/Mathematics"
//         className="block text-sm hover:underline p-2"
//       >
//         Mathematics
//       </Link>
//       <Link to="/course/Physics" className="block text-sm hover:underline p-2">
//         Physics
//       </Link>
//       <Link
//         to="/course/Chemistry"
//         className="block text-sm hover:underline p-2"
//       >
//         Chemistry
//       </Link>
//     </div>
//   );
// };

// const BiPCSubjects = () => {
//   return (
//     <div className="w-48 bg-white p-6 shadow-xl absolute">
//       <Link to="/course/Biology" className="block text-sm hover:underline p-2">
//         Biology
//       </Link>
//       <Link to="/course/Physics" className="block text-sm hover:underline p-2">
//         Physics
//       </Link>
//       <Link
//         to="/course/Chemistry"
//         className="block text-sm hover:underline p-2"
//       >
//         Chemistry
//       </Link>
//     </div>
//   );
// };

// const SeniorSecondaryFlyout = () => {
//   return (
//     <div className="w-48 bg-white p-6 shadow-xl absolute space-y-2">
//       <FlyoutLink
//         href="/category/Senior%20Secondary"
//         FlyoutContent={MPCSubjects}
//         direction="right"
//       >
//         MPC
//       </FlyoutLink>
//       <FlyoutLink
//         href="/category/Senior%20Secondary"
//         FlyoutContent={BiPCSubjects}
//         direction="right"
//       >
//         BiPC
//       </FlyoutLink>
//     </div>
//   );
// };

// // ----- Dynamic Nested Flyout for a Category -----
// const DynamicCategoryFlyout = ({ category }) => {
//   // If the category is "Senior Secondary", use the custom nested flyout
//   if (category.name === "Senior Secondary") {
//     return <SeniorSecondaryFlyout />;
//   }
//   // Otherwise, render a dynamic flyout listing courses
//   return (
//     <div className="w-48 bg-white p-6 shadow-xl absolute">
//       {/* {category.courses.map((course) => (
//         <Link
//           key={course}
//           to={`/course/${encodeURIComponent(course)}`}
//           className="block text-sm hover:underline p-2"
//         >
//           {course}
//         </Link>
//       ))} */}

//       {category.courses.map((course) => (
//         <Link
//           key={course}
//           to="#"
//           onClick={async (e) => {
//             e.preventDefault();
//             const id = await fetchCourseId(course);
//             if (id) window.location.href = `/courses/${id}`;
//           }}
//           className="block text-sm hover:underline p-2"
//         >
//           {course}

//         </Link>

//       ))}
//     </div>
//   );
// };

// // ----- Dynamic PricingContent -----
// // This flyout is shown when hovering over "Explore" and maps over your data.
// const PricingContent = () => {
//   return (
//     <div className="w-64 bg-white p-6 shadow-xl">
//       {categoriesData.map((cat) => (
//         <FlyoutLink
//           key={cat.name}
//           href={`/category/${encodeURIComponent(cat.name)}`}
//           // Use our dynamic flyout, with a special case for Senior Secondary.
//           FlyoutContent={() => <DynamicCategoryFlyout category={cat} />}
//           direction="right"
//         >
//           {cat.name}
//         </FlyoutLink>
//       ))}
//       <button className="w-full rounded-lg border-2 border-neutral-950 px-4 py-2 mt-4 font-semibold transition-colors hover:bg-neutral-950 hover:text-white">
//         Contact sales
//       </button>
//     </div>
//   );
// };

// // ----- Top-level Explore Component -----
// // The Explore link (and its flyout) remains unchanged in UI.
// const Explore = () => {
//   return (
//     <div className="flex justify-center absolute top-1/2 transform -translate-x-[90%] -translate-y-1/2 text-base p-4">
//       <FlyoutLink FlyoutContent={PricingContent} showArrow={false}>
//         Explore
//       </FlyoutLink>
//     </div>
//   );
// };
