import React from 'react';
const ParentComponent = () => {
    const courseData = {
        title: "Modern Full-Stack Development with React & Node.js",
        subtitle: "Build, deploy, and scale modern web applications",
        description: "Master full-stack development using React, Node.js, Express, and MongoDB. Learn to build secure, scalable applications with best practices.",
        rating: 4.8,
        reviewsCount: 3250,
        instructor: {
          name: "Sarah Johnson",
          avatar: "/images/instructors/sarah-johnson.jpg",
          bio: "Lead Developer at Tech Corp, 10+ years experience in full-stack development",
          contact: "sarah@codeacademy.com"
        },
        category: "Web Development",
        level: "Intermediate",
        duration: 42,
        lessonsCount: 218,
        language: "English",
        prerequisites: ["Basic JavaScript", "HTML/CSS Fundamentals"],
        topicsCovered: [
          "React Hooks",
          "State Management",
          "REST APIs",
          "JWT Authentication",
          "MongoDB Integration",
          "Deployment Strategies"
        ],
        modules: [
          {
            title: "React Fundamentals",
            lessons: [
              { 
                title: "Introduction to JSX", 
                duration: "25:00",
                resources: ["jsx-cheatsheet.pdf"]
              },
              { 
                title: "Component Architecture", 
                duration: "35:00",
                resources: ["component-examples.zip"]
              }
            ]
          },
          {
            title: "Backend Development",
            lessons: [
              { 
                title: "Setting Up Express Server", 
                duration: "40:00",
                resources: ["express-boilerplate.zip"]
              },
              { 
                title: "Database Design with MongoDB", 
                duration: "55:00"
              }
            ]
          }
        ],
        price: 299.99,
        discount: "30% Launch Discount!",
        paymentOptions: ["Credit Card", "PayPal", "Cryptocurrency"],
        certificate: true,
        lifetimeAccess: true,
        jobAssistance: true,
        downloadableResources: [
          { name: "Project Wireframes", type: "PDF" },
          { name: "API Documentation", type: "Markdown" }
        ],
        faqs: [
          {
            question: "What if I miss a live session?",
            answer: "All sessions are recorded and available for lifetime access"
          },
          {
            question: "Is there a money-back guarantee?",
            answer: "30-day no-questions-asked refund policy"
          }
        ],
        studentFeedback: [
          {
            user: "John D.",
            comment: "Best course I've taken! Projects are industry-relevant.",
            rating: 5
          },
          {
            user: "Maria S.",
            comment: "Excellent balance between theory and practice.",
            rating: 4.5
          }
        ],
        communityAccess: {
          discord: "https://discord.gg/example",
          forum: "https://forum.codeacademy.com"
        },
        previewContent: {
          videoUrl: "https://youtube.com/embed/course-preview",
          freeLessons: 3
        }
      };
      
}
const CourseTemplate = ({ courseData }) => {
  return (
    <div className="course-container">
      {/* Header Section */}
      <header className="course-header">
        <h1>{courseData.title}</h1>
        <p className="subtitle">{courseData.subtitle}</p>
        <div className="preview-cta">
          <button className="enroll-btn">Enroll Now</button>
          <button className="preview-btn">Preview Course</button>
        </div>
      </header>

      {/* Course Details Section */}
      <section className="course-details">
        <div className="details-grid">
          <div className="rating">
            <span>{courseData.rating}</span>
            <span>({courseData.reviewsCount} reviews)</span>
          </div>
          <div className="instructor">
            <h3>Instructor</h3>
            <div className="instructor-profile">
              <img src={courseData.instructor.avatar} alt="instructor" />
              <span>{courseData.instructor.name}</span>
            </div>
          </div>
          <div className="category">
            <h3>Category</h3>
            <p>{courseData.category}</p>
          </div>
          <div className="level">
            <h3>Level</h3>
            <p>{courseData.level}</p>
          </div>
        </div>
      </section>

      {/* Course Content Section */}
      <section className="curriculum">
        <h2>Course Content</h2>
        <div className="duration">
          {courseData.duration} hours • {courseData.lessonsCount} lessons
        </div>
        
        {courseData.modules.map((module, index) => (
          <div className="module" key={index}>
            <h3>{module.title}</h3>
            <div className="lessons">
              {module.lessons.map((lesson, idx) => (
                <div className="lesson" key={idx}>
                  <span>{lesson.title}</span>
                  <span>{lesson.duration}</span>
                  {lesson.resources && <span>📎</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <div className="price-card">
          <h2>{courseData.price ? `$${courseData.price}` : 'Free'}</h2>
          {courseData.discount && <div className="discount">{courseData.discount}</div>}
          <button className="enroll-btn">Enroll Now</button>
          <div className="payment-options">
            {courseData.paymentOptions.map((option, index) => (
              <span key={index}>{option}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="certification">
        <h2>What's Included</h2>
        <div className="benefits">
          {courseData.certificate && <div>🎓 Certificate of Completion</div>}
          {courseData.lifetimeAccess && <div>🔑 Lifetime Access</div>}
          {courseData.jobAssistance && <div>💼 Job Assistance</div>}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        {courseData.faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>

      {/* Footer CTA */}
      <div className="final-cta">
        <h2>Start Learning Today!</h2>
        <button className="enroll-btn">Enroll Now</button>
      </div>
    </div>
  );
};

export default CourseTemplate;