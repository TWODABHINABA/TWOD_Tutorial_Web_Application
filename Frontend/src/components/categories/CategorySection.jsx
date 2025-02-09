import React from 'react';
import { motion } from 'framer-motion';
import './CategorySec.css';

const categories = [
  { title: "Science", courses: "1,391 courses", icon: "uil uil-atom" },
  { title: "Business", courses: "3,234 courses", icon: "uil uil-briefcase" },
  { title: "Finance Accounting", courses: "931 courses", icon: "uil uil-calculator" },
  { title: "Design", courses: "7,291 courses", icon: "uil uil-pen" },
  { title: "Music", courses: "9,114 courses", icon: "uil uil-music" },
  { title: "Marketing", courses: "2,391 courses", icon: "uil uil-chart-pie" },
  { title: "Photography", courses: "7,991 courses", icon: "uil uil-camera" },
  { title: "Animation", courses: "6,491 courses", icon: "uil uil-circle-layer" },
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
            <motion.a
              key={index}
              href="#"
              className="category grid-item"
              variants={cardVariants}
            >
              <div className="icon">
                <i className={cat.icon}></i>
              </div>
              <div className="content">
                <h3>{cat.title}</h3>
                <span>{cat.courses}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;
