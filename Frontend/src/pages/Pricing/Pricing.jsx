import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  // Inline styles
  const containerStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  };

  const titleStyle = {
    fontSize: '3rem',
    marginBottom: '40px',
  };

  const cardsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    padding: '20px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  };



  const planTitleStyle = {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  };

  const planPriceStyle = {
    fontSize: '1.5rem',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#007bff',
  };

  const planFeaturesStyle = {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '20px',
  };

  const planFeatureStyle = {
    fontSize: '1rem',
    margin: '10px 0',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  const navigate=useNavigate();
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Course Pricing</h1>
      <div style={cardsContainerStyle}>
        {/* Free Plan */}
        <div
          style={cardStyle}
          className="pricing-card"
        >
          <h2 style={planTitleStyle}>Free Plan</h2>
          <p style={planPriceStyle}>₹0</p>
          <ul style={planFeaturesStyle}>
            <li style={planFeatureStyle}>Access to basic courses</li>
            <li style={planFeatureStyle}>1 course per month</li>
            <li style={planFeatureStyle}>Email support</li>
          </ul>
          <button
            onClick={()=>navigate("/")}
            style={buttonStyle}
            onMouseEnter={e => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseLeave={e => (e.target.style.backgroundColor = '#007bff')}
          >
            Sign Up
          </button>
        </div>

        {/* Basic Plan */}
        <div
          style={cardStyle}
          className="pricing-card"
        >
          <h2 style={planTitleStyle}>Basic Plan</h2>
          <p style={planPriceStyle}>₹999/month</p>
          <ul style={planFeaturesStyle}>
            <li style={planFeatureStyle}>Access to all courses</li>
            <li style={planFeatureStyle}>5 courses per month</li>
            <li style={planFeatureStyle}>Priority support</li>
          </ul>
          <button
            style={buttonStyle}
            onMouseEnter={e => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseLeave={e => (e.target.style.backgroundColor = '#007bff')}
          >
            Choose Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div
          style={cardStyle}
          className="pricing-card"
        >
          <h2 style={planTitleStyle}>Premium Plan</h2>
          <p style={planPriceStyle}>₹1999/month</p>
          <ul style={planFeaturesStyle}>
            <li style={planFeatureStyle}>Unlimited course access</li>
            <li style={planFeatureStyle}>Unlimited courses per month</li>
            <li style={planFeatureStyle}>24/7 premium support</li>
            <li style={planFeatureStyle}>Access to exclusive webinars</li>
          </ul>
          <button
            style={buttonStyle}
            onMouseEnter={e => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseLeave={e => (e.target.style.backgroundColor = '#007bff')}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
