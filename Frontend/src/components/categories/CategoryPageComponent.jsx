// CategoryPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import CategorySection from '../components/CategorySec';

const CategoryPage = () => {
  const { categorySlug } = useParams();

  // Add your course filtering logic here
  return (
    <div className="category-page">
      <h1>{categorySlug.replace(/-/g, ' ')} Courses</h1>
      {/* Display filtered courses here */}
      <CategorySection /> {/* Or create a CourseList component */}
    </div>
  );
};

export default CategoryPage;