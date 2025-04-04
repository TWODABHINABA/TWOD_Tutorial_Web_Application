import CustomNavbar from '../../components/navbar/Navbar';
import Foote from '../../components/footer/Footer';
import { Link } from 'react-router-dom';

const styles = {
  base: {
    fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontSize: '1.2rem'
  },
  h1: {
    color: 'rgb(255 90 31)'
  },
  h2: {
    fontSize: '1.5em',
    color: 'rgb(255 90 31)'
  }
};

const TermsAndConditions = () => {
  return (
    <div style={styles.base} className='w-full'>
      <CustomNavbar />
      <br />
      <div className="container mx-auto p-6">
        <h1 style={styles.h1} className="text-3xl font-bold">Terms and Conditions</h1>
        <p className="mt-4 text-gray-700">
          Welcome to <b>Tutor</b>! These terms and conditions outline the
          rules and regulations for the use of our website.
        </p>
      </div>
      <br />
      <div className="container mx-auto p-6">
        <h2 style={styles.h2} className="text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-gray-700 mt-2">
          By accessing this website, you agree to comply with these terms. If you
          do not agree with any part of these terms, please do not use our
          website.
        </p>
        
        <h2 style={styles.h2} className="text-2xl font-semibold mt-6">2. Use of Website</h2>
        <p className="text-gray-700 mt-2">
          You may use our website only for lawful purposes. You are prohibited
          from violating laws, transmitting harmful software, or engaging in
          fraudulent activities.
        </p>

        <h2 style={styles.h2} className="text-2xl font-semibold mt-6">3. Intellectual Property</h2>
        <p className="text-gray-700 mt-2">
          All content on this website, including text, images, and logos, is
          protected by copyright and intellectual property laws. You may not
          reproduce or distribute any material without permission.
        </p>
        
        <h2 style={styles.h2} className="text-2xl font-semibold mt-6">4. Changes to Terms</h2>
        <p className="text-gray-700 mt-2">
          We reserve the right to modify these terms at any time. By continuing
          to use our website, you accept any changes to the terms and
          conditions.
        </p>
        
        <h2 style={styles.h2} className="text-2xl font-semibold mt-6">5. Contact Us</h2>
        <Link to="/contact" className="text-blue-700 hover:underline">
          <span>&#9742;</span> Contact us
        </Link>
        <p className="text-gray-700 mt-2">
          If you have any questions about these Terms and Conditions, please
          contact us at <strong>support@tutor.com</strong>.
        </p>
      </div>
      <br /><br /><br />
      <Foote />
    </div>
  );
};

export default TermsAndConditions;
