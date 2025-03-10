import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Resource = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out' });
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className=" min-h-screen flex flex-col">
      <CustomNavbar />
      <div className="flex-1 text-center p-10 bg-[#FAF3E0]">
        <section className="mb-16" data-aos="fade-down">
          <h2 className="text-5xl font-extrabold text-orange-400">Explore Our Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {courses.map((course, index) => (
              <motion.div key={index} className="bg-white p-6 rounded-lg shadow-md hover:-translate-y-2 hover:shadow-xl transition-transform" data-aos="fade-right">
                <h3 className="text-lg font-semibold text-orange-600">{course.title}</h3>
                <p className="text-gray-700 mt-2">{course.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16" data-aos="fade-down">
          <h2 className="text-5xl font-extrabold text-orange-400">Meet Our Tutors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {tutors.map((tutor, index) => (
              <motion.div key={index} className="bg-white p-6 rounded-lg shadow-md hover:-translate-y-2 hover:shadow-xl transition-transform" data-aos="fade-left">
                <h3 className="text-lg font-semibold text-orange-600">{tutor.name}</h3>
                <h4 className="text-md font-medium text-orange-500">{tutor.expertise}</h4>
                <p className="text-gray-700 mt-2">{tutor.bio}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16" data-aos="fade-down">
          <h2 className="text-5xl font-extrabold text-orange-400">Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {plans.map((plan, index) => (
              <motion.div key={index} className="bg-white p-6 rounded-lg shadow-md hover:-translate-y-2 hover:shadow-xl transition-transform" data-aos="zoom-in">
                <h3 className="text-lg font-semibold text-orange-600">{plan.title}</h3>
                <h4 className="text-md font-medium text-orange-500">{plan.price}</h4>
                <ul className="text-gray-700 mt-2">
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

const courses = [
  { title: 'Web Development', description: 'Learn HTML, CSS, JavaScript, and React to build modern web applications.' },
  { title: 'Database Management', description: 'Master MongoDB and SQL for efficient database management.' },
  { title: 'Backend Development', description: 'Explore Node.js, Express, and microservices architecture.' }
];

const tutors = [
  { name: 'John Doe', expertise: 'Web Development', bio: 'Experienced frontend developer with 8+ years in React.' },
  { name: 'Jane Smith', expertise: 'Database Management', bio: 'Database expert specializing in security and optimization.' },
  { name: 'Michael Brown', expertise: 'Backend Development', bio: 'Backend engineer skilled in APIs and cloud computing.' }
];

const plans = [
  { title: 'Free Plan', price: '$0', features: ['Basic courses', '1 course per month', 'Community support'] },
  { title: 'Basic Plan', price: '$9/month', features: ['All courses', '5 courses per month', 'Email support'] },
  { title: 'Premium Plan', price: '$99/month', features: ['Unlimited courses', '24/7 support', 'Live mentor sessions'] }
];