import React from 'react';

export const Resource = () => {
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
  ];

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      color: '#333',
    },
    description: {
      textAlign: 'center',
      color: '#666',
    },
    resourceList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    resourceItem: {
      border: '1px solid #ddd',
      borderRadius: '5px',
      padding: '15px',
      backgroundColor: '#f9f9f9',
      transition: 'box-shadow 0.3s',
    },
    resourceItemHover: {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    resourceTitle: {
      margin: '0 0 10px',
      color: '#007bff',
    },
    resourceDescription: {
      margin: '0 0 10px',
    },
    resourceLink: {
      color: '#007bff',
      textDecoration: 'none',
    },
    resourceLinkHover: {
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.container} className='resource'>
      <h1 style={styles.header}>Resources</h1>
      <p style={styles.description}>
        Explore our curated list of resources to enhance your learning experience.
      </p>
      <div style={styles.resourceList}>
        {resources.map((resource, index) => (
          <div
            key={index}
            style={styles.resourceItem}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = styles.resourceItemHover.boxShadow)}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            <h2 style={styles.resourceTitle}>{resource.title}</h2>
            <p style={styles.resourceDescription}>{resource.description}</p>
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.resourceLink}
            >
              Visit Resource
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};