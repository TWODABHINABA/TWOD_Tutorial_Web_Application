import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SidebarMobile from './SidebarMobile';

const Controls = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-white">
      {/* Sidebar */}
      <div className='absolute md:static top-0 left-0 z-50'>
        <div className='max-md:hidden'>
        <Sidebar />
        </div>
            <div className='md:hidden'>

        <SidebarMobile/>
            </div>
      </div>

      {/* Main Content */}
      <div className="w-full z-0 relative">
        {/* Pass the title prop to show "Controls" */}
        <Navbar title="Controls" />
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          {/* Add Course Button */}
          <button
            onClick={() => navigate('/tutor-add-course')}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors w-full sm:w-auto"
          >
            Add Course
          </button>

          {/* Add Availability Button */}
          <button
            onClick={() => navigate('/tutor-add-availability')}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors w-full sm:w-auto"
          >
            Add Availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
