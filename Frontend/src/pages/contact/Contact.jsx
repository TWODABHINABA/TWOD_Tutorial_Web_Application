import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./contact.css";
import CustomNavbar from "../../components/navbar/Navbar";
import Foote from "../../components/footer/Footer";
import { ClipLoader } from "react-spinners";

const Contact = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      disable: window.innerWidth < 768, // Disables AOS on mobile devices
    });
  }, []);
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={80} color="#FFA500" />
      </div>
    );

  return (
    <>
      <CustomNavbar />

      <section className="contact-section">
        <div className="container">
          <header className="contact-header" data-aos="fade-down">
            <h1>Contact Us</h1>
            <p>Have questions or feedback? We’d love to hear from you.</p>
          </header>

          <div className="contact-content">
            <div className="contact-info" data-aos="fade-right">
              <h2>Get in Touch</h2>
              <p>
                Reach out to TUTOR for any queries regarding our courses or
                services.
              </p>
              <ul>
                <li>
                  <strong>Email:</strong> support@tutor.com
                </li>
                <li>
                  <strong>Phone:</strong> +1 234 567 890
                </li>
                <li>
                  <strong>Address:</strong> 123 Learning Lane, Knowledge City,
                  Education State
                </li>
              </ul>
            </div>

            <div className="contact-form-container" data-aos="fade-left">
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="Subject"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Your Message"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Foote />
    </>
  );
};

export default Contact;
