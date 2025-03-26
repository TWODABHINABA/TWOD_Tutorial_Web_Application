import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from "../../components/User-management/api"; // Adjust path as needed
import './categorySec.css';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check window width to determine if it is mobile
    if (window.innerWidth <= 2000 ) {
      setIsMobile(true);
    }
    
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories"); 
        const formattedData = response.data.map((cat) => ({
          title: cat.category, 
          courses: `${cat.courses.length} courses`, 
          slug: cat.category.toLowerCase().replace(/\s+/g, "-"), 
          icon: "uil uil-folder" 
        }));
        setCategories(formattedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="untree_co-section">
      <div className="container">
        <motion.div 
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="line-bottom">Browse Top Category</h2>
        </motion.div>
        <motion.div 
          className="grid-container"
          variants={containerVariants}
          initial="hidden"
          // Use animate on mobile; whileInView for larger screens
          {...(isMobile 
            ? { animate: "visible" } 
            : { whileInView: "visible", viewport: { once: true, amount: 0.2 } })}
        >
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              className="category grid-item"
              variants={cardVariants}
            >
              <Link 
                to={`/category/${cat.slug}`} 
                className="category-link"
              >
                <div className="icon">
                  <i className={cat.icon}></i>
                </div>
                <div className="content">
                  <h3>{cat.title}</h3>
                  <span>{cat.courses}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;
