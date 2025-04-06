import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SidebarMobile from './SidebarMobile';

const Requests = () => {
  const navigate = useNavigate();

  // Dummy notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      studentName: "John Doe",
      course: "React for Beginners",
      date: "2025-04-06",
      status: "pending",
    },
    {
      id: 2,
      studentName: "Aisha Khan",
      course: "Data Structures in JS",
      date: "2025-04-05",
      status: "pending",
    },
  ]);

  const handleAction = (id, action) => {
    setNotifications((prev) =>
      prev.map((noti) =>
        noti.id === id ? { ...noti, status: action } : noti
      )
    );
  };

  return (
    <div className="flex bg-white min-h-screen">
      {/* Sidebar */}
      <div className="absolute md:static top-0 left-0 z-50">
        <div className="max-md:hidden">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <SidebarMobile />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full z-0 relative">
        <Navbar title="Requests" />

        <div className="p-4 bg-[#FAF3E0]">
          <h2 className="text-xl font-bold text-orange-500 mb-4">
            Course Booking Requests
          </h2>

          <div className="space-y-4">
            {notifications.map((noti) => (
              <div
                key={noti.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div>
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{noti.studentName}</span> has requested to join{' '}
                    <span className="font-semibold">{noti.course}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Requested on {noti.date}
                  </p>
                </div>

                <div className="mt-2 sm:mt-0 flex gap-2">
                  {noti.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleAction(noti.id, "accepted")}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(noti.id, "rejected")}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-3 py-1 text-sm rounded ${
                        noti.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {noti.status.charAt(0).toUpperCase() + noti.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;
