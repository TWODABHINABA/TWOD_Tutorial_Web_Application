import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
const AdminControls = () => {
    const navigate = useNavigate();
    return (
        <div className="flex bg-white">
            {/* Sidebar */}
            <div className='absolute md:static top-0 left-0 z-50'>
                <div className='max-md:hidden'>
                    <AdminSidebar />
                </div>

            </div>
            <div className="w-full z-0 relative ml-0">
                <AdminNavbar title="Admin Controls" />
                <div className="p-4 flex flex-col sm:flex-row gap-4">

                    <button
                        onClick={() => navigate('/add-tutor')}
                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors w-full sm:w-auto"
                    >
                        Add Tutor
                    </button>


                    <button
                        onClick={() => navigate('/add-session-time')}
                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors w-full sm:w-auto"
                    >
                        Add Session Time
                    </button>

                    <button
                        onClick={() => navigate("/add-course")}
                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors w-full sm:w-auto"
                    >
                        Add Course
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminControls;
