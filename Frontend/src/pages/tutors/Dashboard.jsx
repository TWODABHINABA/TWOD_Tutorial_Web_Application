// import React from "react";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
// import SidebarMobile from "./SidebarMobile";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="flex min-h-screen bg-gray-100 z-50">
//       {/* Sidebar for Desktop and Mobile */}
//       <div className="absolute md:static top-0 left-0 z-50">
//         <div className="max-md:hidden">
//           <Sidebar />
//         </div>
//         <div className="md:hidden">
//           <SidebarMobile />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="w-full z-0 relative ml-0">
//         {/* Navbar with Dashboard Title */}
//         <Navbar title="Dashboard" />

//         {/* Teacher Dashboard Content */}
//         <div className="p-4">
//           {/* Overview Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div className="bg-white p-4 rounded shadow">
//               <h2 className="text-lg font-semibold">Total Students</h2>
//               <p className="text-2xl mt-2">120</p>
//             </div>
//             <div className="bg-white p-4 rounded shadow">
//               <h2 className="text-lg font-semibold">Upcoming Classes</h2>
//               <p className="text-2xl mt-2">3</p>
//             </div>
//             <div className="bg-white p-4 rounded shadow">
//               <h2 className="text-lg font-semibold">Pending Assignments</h2>
//               <p className="text-2xl mt-2">5</p>
//             </div>
//           </div>

//           {/* Performance Metrics Section */}
//           <div className="mt-6">
//             <div className="bg-white p-4 rounded shadow">
//               <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="p-4 border rounded">
//                   <h3 className="font-semibold">Student Progress</h3>
//                   <p className="mt-2">75% average completion</p>
//                 </div>
//                 <div className="p-4 border rounded">
//                   <h3 className="font-semibold">Feedback Score</h3>
//                   <p className="mt-2">4.5 / 5</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Notifications Section */}
//           <div className="mt-6">
//             <div className="bg-white p-4 rounded shadow">
//               <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
//               <ul className="divide-y divide-gray-200">
//                 <li className="py-2">
//                   <p className="text-gray-800">
//                     John Doe submitted assignment for React Basics.
//                   </p>
//                   <p className="text-gray-600 text-xs">Just now</p>
//                 </li>
//                 <li className="py-2">
//                   <p className="text-gray-800">
//                     Aisha Khan joined your class JS Data Structures.
//                   </p>
//                   <p className="text-gray-600 text-xs">1 hour ago</p>
//                 </li>
//                 <li className="py-2">
//                   <p className="text-gray-800">
//                     New assignment posted for Advanced React.
//                   </p>
//                   <p className="text-gray-600 text-xs">3 hours ago</p>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Upcoming Classes Section */}
//           <div className="mt-6">
//             <div className="bg-white p-4 rounded shadow">
//               <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
//               <ul className="divide-y divide-gray-200">
//                 <li className="py-2 flex justify-between">
//                   <span>React Basics</span>
//                   <span className="text-gray-600 text-xs">Tomorrow 10:00 AM</span>
//                 </li>
//                 <li className="py-2 flex justify-between">
//                   <span>JS Data Structures</span>
//                   <span className="text-gray-600 text-xs">Friday 2:00 PM</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import SidebarMobile from "./SidebarMobile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../components/User-management/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalStudents, setTotalStudents] = useState(0);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [previousClasses, setPreviousClasses] = useState([]);
  const [subjectCounts, setSubjectCounts] = useState({});
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [showPreviousModal, setShowPreviousModal] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");

        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/dashboard");
        const { totalStudents, enrolledSubjects, upcomingClasses, previousClasses } = res.data;

        setTotalStudents(totalStudents || 0);
        setSubjectCounts(enrolledSubjects || {});
        setUpcomingClasses(upcomingClasses || []);
        setPreviousClasses(previousClasses || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data.students);
      console.log(res.data.students);
      setShowStudentModal(true);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  console.log("previousClasses", previousClasses);
  const firstFive = upcomingClasses.slice(0, 5);
  const firstFivePrevious = previousClasses.slice(0, 5);
  return (
    <div className="flex min-h-screen bg-gray-100 z-50">
      <div className="absolute md:static top-0 left-0 z-50">
        <div className="max-md:hidden">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <SidebarMobile />
        </div>
      </div>


      <div className="w-full z-0 relative ml-0">

        <Navbar title="Dashboard" user={user} />


        <div className="p-4">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Total Students</h2>
              <p className="text-2xl mt-2">{totalStudents}</p>
              <button
                onClick={fetchStudents}
                className="text-sm mt-2 text-blue-600 underline hover:text-blue-800"
              >
                View All
              </button>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Upcoming Classes</h2>
              <p className="text-2xl mt-2">{upcomingClasses.length}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Subjects You Teach</h2>
              <p className="text-2xl mt-2">
                {Object.keys(subjectCounts).length}
              </p>
            </div>
          </div>

          {/* enrolledSubjects */}
          {/* <div className="mt-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Enrolled Subjects</h2>
              <ul className="divide-y divide-gray-200">
                {Object.entries(subjectCounts).map(([subject, count]) => (
                  <li key={subject} className="py-2 flex justify-between">
                    <span>{subject}</span>
                    <span className="text-gray-600 text-sm">
                      {count} students
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div> */}

          {/* Upcoming Classes Section */}
          <div className="mt-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
              {upcomingClasses.length === 0 ? (
                <p className="text-gray-600">No upcoming classes scheduled.</p>
              ) : (
                <>
                  <ul className="divide-y divide-gray-200">
                    {firstFive.map((item, index) => (
                      <li key={index} className="py-2 flex justify-between">
                        <span>
                          {item.subject}, {item.grade} — {item.studentName}
                        </span>
                        <span>payment Status: {item.status}</span>
                        <span className="text-gray-600 text-sm">
                          {item.date} at {item.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {upcomingClasses.length > 5 && (
                    <button
                      onClick={() => setShowUpcomingModal(true)}
                      className="mt-4 text-blue-600 hover:underline"
                    >
                      View All
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Modal */}
            {showUpcomingModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">All Upcoming Classes</h3>
                    <button
                      onClick={() => setShowUpcomingModal(false)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Close
                    </button>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {upcomingClasses.map((item, index) => (
                      <li key={index} className="py-2 flex justify-between">
                        <span>
                          {item.subject}, {item.grade} — {item.studentName}
                        </span>
                        <span>payment Status: {item.status}</span>
                        <span className="text-gray-600 text-sm">
                          {item.date} at {item.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Previous Classes Section */}
          <div className="mt-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Previous Classes</h2>
              {previousClasses.length === 0 ? (
                <p className="text-gray-600">No previous classes recorded.</p>
              ) : (
                <>
                  <ul className="divide-y divide-gray-200">
                    {firstFivePrevious.map((item, index) => (
                      <li key={index} className="py-2 flex justify-between">
                        <span>
                          {item.subject}, {item.grade} — {item.studentName}
                        </span>
                        <span>payment Status: {item.status}</span>
                        <span className="text-gray-600 text-sm">
                          {item.date} at {item.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {previousClasses.length > 5 && (
                    <button
                      onClick={() => setShowPreviousModal(true)}
                      className="mt-4 text-blue-600 hover:underline"
                    >
                      View All
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Modal */}
            {showPreviousModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">All Previous Classes</h3>
                    <button
                      onClick={() => setShowPreviousModal(false)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Close
                    </button>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {previousClasses.map((item, index) => (
                      <li key={index} className="py-2 flex justify-between">
                        <span>
                          {item.subject}, {item.grade} — {item.studentName}
                        </span>
                        <span>payment Status: {item.status}</span>
                        <span className="text-gray-600 text-sm">
                          {item.date} at {item.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>


          {/* You can keep this or remove it depending on future use */}
          {/* 
          <div className="mt-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
              ...
            </div>
          </div> 
          */}
          {showStudentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
              <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 max-h-[80vh] overflow-y-auto relative">
                {/* Close button */}
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
                  title="Close"
                >
                  &times;
                </button>

                {/* Header */}
                <h3 className="text-2xl font-bold mb-4 text-center">
                  Enrolled Students
                </h3>

                {/* Student List */}
                {students.length === 0 ? (
                  <p className="text-gray-500 text-center">
                    No students found.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {students.map(({ student, transactions }) => (
                      <li
                        key={student._id}
                        className="border border-gray-200 p-4 rounded-md bg-gray-50"
                      >
                        <p>
                          <strong>Name:</strong> {student.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {student.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {student.phone || "N/A"}
                        </p>
                        <p>
                          <strong>Purchased Courses:</strong>
                          <ul>
                            {transactions.map((txn, idx) => {
                              const courseName = txn.courseId?.name || "Course";
                              const courseType = txn.courseId?.courseType || "N/A";

                              // Extract date and time
                              const selectedDate = new Date(txn.selectedDate); // "2025-04-18"
                              const startTimeStr = txn.selectedTime.split("-")[0].trim(); // "05:00 AM"

                              // Convert to 24-hour time
                              const [time, modifier] = startTimeStr.split(" ");
                              let [hours, minutes] = time.split(":").map(Number);
                              if (modifier === "PM" && hours !== 12) hours += 12;
                              if (modifier === "AM" && hours === 12) hours = 0;

                              selectedDate.setHours(hours);
                              selectedDate.setMinutes(minutes);
                              selectedDate.setSeconds(0);

                              const now = new Date();
                              const classStatus = selectedDate > now ? "Upcoming" : "Completed";

                              let paymentStatus = "Pending";
                              if (txn.status === "completed") paymentStatus = "Paid";
                              else if (txn.status === "accepted") paymentStatus = "Accepted (Pay Later)";
                              else if (txn.status === "pending for tutor acceptance") paymentStatus = "Pending for Tutor Acceptance (you have to accept the class)";
                              else if (txn.status === "rejected") paymentStatus = "Rejected";

                              return (
                                <li key={idx}>
                                  {courseName}, {courseType} — <strong>{classStatus}</strong> | Payment: <strong>{paymentStatus}</strong>
                                </li>
                              );
                            })}
                          </ul>
                        </p>

                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
