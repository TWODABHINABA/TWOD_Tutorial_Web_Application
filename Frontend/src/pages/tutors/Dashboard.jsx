import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import SidebarMobile from "./SidebarMobile";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100 z-50">
      {/* Sidebar for Desktop and Mobile */}
      <div className="absolute md:static top-0 left-0 z-50">
        <div className="max-md:hidden">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <SidebarMobile />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full z-0 relative ml-0">
        {/* Navbar with Dashboard Title */}
        <Navbar title="Dashboard" />

        {/* Teacher Dashboard Content */}
        <div className="p-4">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Total Students</h2>
              <p className="text-2xl mt-2">120</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Upcoming Classes</h2>
              <p className="text-2xl mt-2">3</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Pending Assignments</h2>
              <p className="text-2xl mt-2">5</p>
            </div>
          </div>

          {/* Performance Metrics Section */}
          <div className="mt-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <h3 className="font-semibold">Student Progress</h3>
                  <p className="mt-2">75% average completion</p>
                </div>
                <div className="p-4 border rounded">
                  <h3 className="font-semibold">Feedback Score</h3>
                  <p className="mt-2">4.5 / 5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Notifications Section */}
          <div className="mt-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
              <ul className="divide-y divide-gray-200">
                <li className="py-2">
                  <p className="text-gray-800">
                    John Doe submitted assignment for React Basics.
                  </p>
                  <p className="text-gray-600 text-xs">Just now</p>
                </li>
                <li className="py-2">
                  <p className="text-gray-800">
                    Aisha Khan joined your class JS Data Structures.
                  </p>
                  <p className="text-gray-600 text-xs">1 hour ago</p>
                </li>
                <li className="py-2">
                  <p className="text-gray-800">
                    New assignment posted for Advanced React.
                  </p>
                  <p className="text-gray-600 text-xs">3 hours ago</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Upcoming Classes Section */}
          <div className="mt-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
              <ul className="divide-y divide-gray-200">
                <li className="py-2 flex justify-between">
                  <span>React Basics</span>
                  <span className="text-gray-600 text-xs">Tomorrow 10:00 AM</span>
                </li>
                <li className="py-2 flex justify-between">
                  <span>JS Data Structures</span>
                  <span className="text-gray-600 text-xs">Friday 2:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
