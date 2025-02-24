import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const Resource = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      document.body.style.overflow = 'auto';
    }, 1000);
  }, []);

  const resources = [
    { title: 'React Documentation', description: 'Official React documentation.', link: 'https://reactjs.org/docs/getting-started.html' },
    { title: 'JavaScript Info', description: 'A modern JavaScript tutorial.', link: 'https://javascript.info/' },
    { title: 'CSS Tricks', description: 'A website about all things CSS.', link: 'https://css-tricks.com/' },
    { title: 'FreeCodeCamp', description: 'Learn to code for free.', link: 'https://www.freecodecamp.org/' },
    { title: 'MDN Web Docs', description: 'Resources for developers, by developers.', link: 'https://developer.mozilla.org/' },
    { title: 'Python for Beginners', description: 'Comprehensive Python tutorials for all levels.', link: 'https://www.python.org/doc/' },
    { title: 'Full Stack Open', description: 'Learn full-stack development with modern technologies.', link: 'https://fullstackopen.com/en/' },
    { title: 'Khan Academy - Math', description: 'Free online courses on mathematics.', link: 'https://www.khanacademy.org/math' },
    { title: 'Science Daily', description: 'Stay updated with the latest scientific discoveries.', link: 'https://www.sciencedaily.com/' },
    { title: 'Spring Boot Guide', description: 'Learn Spring Boot for building Java applications.', link: 'https://spring.io/projects/spring-boot' },
    { title: 'Linux Fundamentals', description: 'Comprehensive guide to Linux operating systems.', link: 'https://linuxfoundation.org/' },
    { title: 'Java Programming', description: 'Comprehensive Java tutorials and resources.', link: 'https://www.oracle.com/java/' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 1 }} 
      className={`container ${darkMode ? 'dark' : ''}`}
    >
      <nav className="navbar">
        <h1>Resources</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/support">Support</Link>
        </div>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </nav>

      <div className="content">
        <h2>Top Learning Resources</h2>
        <p>Explore high-quality learning materials.</p>
        <div className="resource-list">
          {resources.map((resource, index) => (
            <div key={index} className="resource-item">
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <a href={resource.link} target="_blank" rel="noopener noreferrer">Visit →</a>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Learning Resources. All rights reserved.</p>
        <p>Summary: This page provides a curated list of high-quality learning resources to help individuals enhance their knowledge in various fields.</p>
        <p><strong>Access Policy:</strong> All resources listed are freely accessible and belong to their respective owners. We do not claim ownership or responsibility for the content provided by third-party links.</p>
      </footer>

      <style>
        {`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; }
          .container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 20px; max-width: 1200px; margin: auto; }
          .dark { background: #121212; color: #ffffff; }
          .navbar { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #0ea5e9; color: white; width: 100%; border-radius: 8px; position: fixed; top: 0; left: 0; right: 0; z-index: 1000; }
          .nav-links { display: flex; gap: 15px; }
          .nav-links a { text-decoration: none; color: white; padding: 5px 10px; }
          .nav-links a:hover { background: rgba(255, 255, 255, 0.2); border-radius: 5px; }
          .dark-mode-toggle { background: none; border: none; cursor: pointer; color: white; font-size: 20px; }
          .content { text-align: center; padding: 100px 20px 40px; width: 100%; }
          .resource-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; width: 100%; }
          .resource-item { border: 1px solid #ddd; padding: 20px; border-radius: 10px; background: white; transition: transform 0.3s, box-shadow 0.3s; text-align: left; }
          .dark .resource-item { background: #1e1e1e; }
          .resource-item:hover { transform: scale(1.05); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); }
          .footer { text-align: center; padding: 15px; background: #0ea5e9; color: white; width: 100%; border-radius: 8px; margin-top: auto; }
          @media (max-width: 768px) { 
            .nav-links { flex-direction: column; position: absolute; top: 60px; left: 0; right: 0; background: #0ea5e9; padding: 10px; display: none; }
            .nav-links.active { display: flex; }
            .navbar { flex-direction: column; }
            .content { padding-top: 120px; }
          }
        `}
      </style>
    </motion.div>
  );
};
