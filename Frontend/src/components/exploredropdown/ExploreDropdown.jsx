import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import api from "../User-management/api";


const fetchCategories = async () => {
  try {
    const response = await api.get("/categories");
    console.log("dropdown dataaaaaaaaa",response.data);  
    return response.data; 
    
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};


const fetchCourseId = async (courseName, courseType) => {
  try {
    const response = await api.get(`/courses?name=${encodeURIComponent(courseName)}&courseType=${encodeURIComponent(courseType)}`);
    return response.data._id; 
  } catch (error) {
    console.error("Error fetching course ID:", error);
  }
};


const FlyoutLink = ({
  children,
  FlyoutContent,
  direction = "down",
  showArrow = true,
  href, 
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
        className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left rounded-full bg-orange-400 transition-transform duration-300 ease-out"
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
          
            {direction === "right" ? (
              <>
                <div className="absolute -left-6 top-0 bottom-0 w-6 bg-transparent" />
                <div className="absolute top-1/2 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-orange" />
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
  console.log("Category Data:", category); 

  return (
    <div className="w-48 bg-white p-6 shadow-xl absolute">
      {category.courses.length > 0 ? (
        category.courses.map((course, index) => (
          <Link
            key={index}
            to="#"
            onClick={async (e) => {
              e.preventDefault();
              const id = await fetchCourseId(course.name, category.category); // Fixed line
              if (id) window.location.href = `/courses/${id}`;
            }}
            className="block text-sm hover:underline p-2"
          >
            {course.name}
          </Link>
        ))
      ) : (
        <p className="text-gray-500">No courses available</p>
      )}
    </div>
  );
};



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
            key={cat.category}
            href={`/category/${encodeURIComponent(cat.category)}`}
            FlyoutContent={() => <DynamicCategoryFlyout category={cat} />}
            direction="right"
          >
            {cat.category}
          </FlyoutLink>
        ))
      ) : (
        <p>No categories found</p>
      )}
    </div>
  );
};


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