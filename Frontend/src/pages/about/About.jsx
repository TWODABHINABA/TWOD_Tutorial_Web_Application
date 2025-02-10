import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './about.css';
import CustomNavbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 800, 
      once: true,    
    });
  }, []);

  return (
    <>
      <CustomNavbar />

      <section className="about-section">
        <div className="container">
          <header className="about-header" data-aos="fade-down">
            <h1>About TUTOR</h1>
            <p>
              TUTOR is an innovative online learning platform dedicated to empowering learners worldwide through high-quality, accessible courses.
            </p>
          </header>

          <div className="about-content">
            <div className="about-text" data-aos="fade-right">
              <h2>Our Story</h2>
              <p>
                At TUTOR, our journey began with a simple vision: to make education accessible and engaging for everyone, everywhere. We carefully curate courses from industry experts so that every lesson inspires and empowers you.
              </p>
              <p>
                We believe that learning is a lifelong pursuit, and our platform is here to help you unlock your full potential—one course at a time.
              </p>
            </div>
            <div className="about-image" data-aos="fade-left">
              <img src="https://via.placeholder.com/500" alt="About TUTOR" />
            </div>
          </div>

          <div className="about-values" data-aos="zoom-in">
            <h2>Our Core Values</h2>
            <div className="values-grid">
              <div className="value-card" data-aos="flip-left">
                <h3>Empowerment</h3>
                <p>We empower every learner to achieve greatness.</p>
              </div>
              <div className="value-card" data-aos="flip-up">
                <h3>Excellence</h3>
                <p>We deliver outstanding educational experiences that pave the way for success.</p>
              </div>
              <div className="value-card" data-aos="flip-right">
                <h3>Community</h3>
                <p>We cultivate a vibrant community where ideas and knowledge thrive.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
