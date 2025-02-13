// src/data.js
export const categories = [
    {
      name: "High School",
      courses: ["English", "Maths", "Science", "Biology", "Social"],
    },
    {
      name: "Senior Secondary",
      courses: ["MPC", "BiPC"],
    },
    {
      name: "Undergraduate",
      courses: [
        "Bachelor of Technology (B.Tech)",
        "Bachelor of Science (BSc)",
        "Bachelor of Commerce (BCom)",
      ],
    },
    {
      name: "AI & ML",
      courses: ["Artificial Intelligence", "Machine Learning", "Deep Learning"],
    },
    {
      name: "Web Development",
      courses: ["React", "HTML", "CSS", "JavaScript", "NodeJS", "MongoDB"],
    },
    {
      name: "Programming",
      courses: ["C", "C++", "Java", "Python", "PHP", "Rust"],
    },
  ];
  
  export const coursesDetails = {
    react: {
      title: "React Mastery Course",
      subtitle: "Become a React Expert from Scratch",
      description:
        "This course covers everything from basic components to advanced state management with Redux, hooks, and context API.",
      rating: 4.7,
      reviews: 124,
      instructor: "Jane Doe",
      category: "Web Development",
      subject: "React & JavaScript",
      level: "Intermediate",
      topics: [
        "Components",
        "State & Props",
        "Lifecycle Methods",
        "Hooks",
        "Routing",
        "Redux",
      ],
      duration: "15 hours",
      language: "English",
      prerequisites: "Basic knowledge of JavaScript, HTML, and CSS",
      modules: [
        {
          title: "Introduction to React",
          lectures: [
            { title: "What is React?", duration: "10 mins" },
            { title: "Setting up the Environment", duration: "15 mins" },
          ],
          quiz: "Quiz 1",
          resources: ["intro-slides.pdf", "setup-guide.zip"],
        },
        {
          title: "Advanced React Concepts",
          lectures: [
            { title: "Hooks Deep Dive", duration: "20 mins" },
            { title: "Context API", duration: "15 mins" },
          ],
          quiz: "Quiz 2",
          resources: ["hooks-cheatsheet.pdf"],
        },
      ],
      price: "$99",
      discount: "20% off with code REACT20",
      paymentOptions: ["One-time payment", "EMI available"],
      certificate: true,
      lifetimeAccess: true,
      jobAssistance: "Career support available",
      faqs: [
        {
          question: "Do I need prior experience?",
          answer: "Basic JavaScript is enough.",
        },
        {
          question: "Can I access the course on mobile?",
          answer: "Yes, it's mobile-friendly.",
        },
      ],
      testimonials: [
        { student: "Alice", feedback: "This course boosted my career!" },
        {
          student: "Bob",
          feedback: "Very informative and well-structured.",
        },
      ],
      community: "Join our Discord community for support.",
      instructorContact: "jane.doe@example.com",
    },
    html: {
      title: "HTML Essentials",
      subtitle: "Learn the basics of HTML",
      description: "This course teaches you how to build web pages using HTML.",
      rating: 4.5,
      reviews: 90,
      instructor: "John Smith",
      category: "Web Development",
      subject: "HTML",
      level: "Beginner",
      topics: ["HTML Basics", "Tags", "Attributes", "Forms"],
      duration: "10 hours",
      language: "English",
      prerequisites: "None",
      modules: [],
      price: "$49",
      discount: "",
      paymentOptions: ["One-time payment"],
      certificate: true,
      lifetimeAccess: true,
      jobAssistance: "",
      faqs: [],
      testimonials: [],
      community: "",
      instructorContact: "john.smith@example.com",
    },

  };
  