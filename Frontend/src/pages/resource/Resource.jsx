import React, { useState } from 'react';

export const Resource = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const resources = [
    {
      title: 'React Documentation',
      description: 'Official React documentation for learning and reference.',
      link: 'https://reactjs.org/docs/getting-started.html',
    },
    {
      title: 'JavaScript Info',
      description: 'A modern tutorial to JavaScript.',
      link: 'https://javascript.info/',
    },
    {
      title: 'CSS Tricks',
      description: 'A website about all things CSS.',
      link: 'https://css-tricks.com/',
    },
    {
      title: 'FreeCodeCamp',
      description: 'Learn to code for free.',
      link: 'https://www.freecodecamp.org/',
    },
    {
      title: 'MDN Web Docs',
      description: 'Resources for developers, by developers.',
      link: 'https://developer.mozilla.org/',
    },
    {
      title: 'Python for Beginners',
      description: 'Comprehensive Python tutorials for all levels.',
      link: 'https://www.python.org/doc/',
    },
    {
      title: 'Full Stack Open',
      description: 'Learn full-stack development with modern technologies.',
      link: 'https://fullstackopen.com/en/',
    },
    {
      title: 'Khan Academy - Math',
      description: 'Free online courses on mathematics.',
      link: 'https://www.khanacademy.org/math',
    },
    {
      title: 'Science Daily',
      description: 'Stay updated with the latest scientific discoveries.',
      link: 'https://www.sciencedaily.com/',
    },
  ];

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      backgroundColor: darkMode ? '#121212' : '#f4f7fc',
      color: darkMode ? '#ffffff' : '#333',
      transition: 'background-color 0.3s, color 0.3s',
    },
    header: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    description: {
      fontSize: '18px',
      marginBottom: '30px',
    },
    resourceList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      justifyContent: 'center',
    },
    resourceItem: {
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '20px',
      backgroundColor: darkMode ? '#1e1e1e' : '#fff',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      textAlign: 'left',
    },
    resourceItemHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
    resourceTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#007bff',
      marginBottom: '10px',
    },
    resourceDescription: {
      fontSize: '16px',
      marginBottom: '15px',
    },
    resourceLink: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#007bff',
      textDecoration: 'none',
    },
    toggleButton: {
      padding: '10px 20px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginBottom: '20px',
      backgroundColor: darkMode ? '#007bff' : '#222',
      color: '#fff',
      transition: 'background-color 0.3s',
    },
  };

  return (
    <div style={styles.container} className='resource'>
      <button style={styles.toggleButton} onClick={toggleDarkMode}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <h1 style={styles.header}>Top Learning Resources</h1>
      <p style={styles.description}>
        Explore our curated list of high-quality learning resources to enhance your skills.
      </p>
      <div style={styles.resourceList}>
        {resources.map((resource, index) => (
          <div
            key={index}
            style={styles.resourceItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.resourceItemHover.transform;
              e.currentTarget.style.boxShadow = styles.resourceItemHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            }}
          >
            <h2 style={styles.resourceTitle}>{resource.title}</h2>
            <p style={styles.resourceDescription}>{resource.description}</p>
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.resourceLink}
            >
              Visit Resource →
            </a>
          </div>
        ))}
      </div>
      <p style={styles.description}>
        These resources provide excellent learning materials on programming, web development, mathematics, and science. Stay curious and keep learning!
      </p>
    </div>
  );
};
