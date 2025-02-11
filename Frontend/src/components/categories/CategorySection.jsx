import React from 'react';
import { motion } from 'framer-motion';
import './CategorySec.css';
import { Link } from 'react-router-dom';
const categories = [
  { title: "AI & ML", courses: "1,391 courses", icon: "uil uil-atom",slug:"ai-ml" },
  { title: "ReactJs", courses: "3,234 courses", icon: "uil uil-briefcase",slug:"react-js" },
  { title: "HTML", courses: "2,391 courses", icon: "uil uil-chart-pie",slug:"html" },
  { title: "Python", courses: "6,491 courses", icon: "uil uil-circle-layer",slug:"python" },
  { title: "English", courses: "7,991 courses", icon: "uil uil-camera",slug:"english" },
  { title: "Maths", courses: "7,291 courses", icon: "uil uil-pen",slug:"maths" },
  { title: "Science", courses: "931 courses", icon: "uil uil-calculator",slug:"science" },
  { title: "Social", courses: "9,114 courses", icon: "uil uil-music",slug:"social" },
];

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
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              // href="#"
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
