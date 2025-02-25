import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { color, motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Resource = () => {
  

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out' });
  }, []);


  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    maxWidth: '1200px',
    margin: 'auto',
  };

  const contentStyle = { flex: 1, textAlign: 'center', padding: '30px 20px' };
  const sectionStyle = { marginBottom: '40px' };
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    marginTop: '10px'
  };
  const cardStyle = {
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: '0.3s'
  };
  const cardHoverStyle = {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  };

  const courses = [
    { title: 'Web Development', description: 'Learn HTML, CSS, JavaScript, and React to build modern, responsive web applications. Gain hands-on experience with real-world projects and industry best practices.' },
    { title: 'Database Management', description: 'Master MongoDB and SQL for handling large-scale data storage, indexing, and retrieval efficiently. Understand database design principles and query optimization.' },
    { title: 'Backend Development', description: 'Explore Node.js, Express, and Spring Boot for building scalable backend solutions with RESTful APIs, authentication, and microservices architecture.' }
  ];

  const tutors = [
    { name: 'John Doe', expertise: 'Web Development', bio: 'John is an experienced frontend developer with 8+ years in React. He has worked with top tech companies and has a deep understanding of modern web frameworks and UI/UX best practices.' },
    { name: 'Jane Smith', expertise: 'Database Management', bio: 'Jane specializes in database architecture, security, and optimization. She has designed complex database systems for fintech and healthcare industries.' },
    { name: 'Michael Brown', expertise: 'Backend Development', bio: 'Michael is a backend engineer skilled in APIs, server-side logic, and cloud computing. He has contributed to scalable applications used by millions of users.' }
  ];

  const plans = [
    { title: 'Free Plan', price: '$0', features: ['Access to basic courses', '1 course per month', 'Community support', 'Limited course materials'] },
    { title: 'Basic Plan', price: '$9/month', features: ['Access to all courses', '5 courses per month', 'Email support', 'Downloadable course materials', 'Certificate of completion'] },
    { title: 'Premium Plan', price: '$99/month', features: ['Unlimited courses', '24/7 priority support', 'Exclusive content', 'Live mentor sessions', 'Advanced projects and certification'] }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} style={containerStyle}>
      <CustomNavbar />
      <div style={contentStyle}>
        <section style={sectionStyle} data-aos="fade-down">
          <h2 className="text-5xl font-extrabold text-blue-600">Explore Our Courses</h2>
          <div style={gridStyle}>
            {courses.map((course, index) => (
              <motion.div key={index} style={{ ...cardStyle, ':hover': cardHoverStyle }} data-aos="fade-right">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section style={sectionStyle} data-aos="fade-down">
          <h2 className="text-5xl font-extrabold text-blue-600">Meet Our Tutors</h2>
          <div style={gridStyle}>
            {tutors.map((tutor, index) => (
              <motion.div key={index} style={{ ...cardStyle, ':hover': cardHoverStyle }} data-aos="fade-left">
                <h3>{tutor.name}</h3>
                <h4>{tutor.expertise}</h4>
                <p>{tutor.bio}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section style={sectionStyle} data-aos="fade-down">
          <h2 className="text-5xl font-extrabold text-blue-600">Pricing Plans</h2>
          <div style={gridStyle}>
            {plans.map((plan, index) => (
              <motion.div key={index} style={{ ...cardStyle, ':hover': cardHoverStyle }} data-aos="zoom-in">
                <h3>{plan.title}</h3>
                <h4>{plan.price}</h4>
                <ul>
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </motion.div>
  );
};
