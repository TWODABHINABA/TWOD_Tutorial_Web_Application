import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import SidebarMobile from "./SidebarMobile";
import { useNavigate } from "react-router-dom";
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
  const [openDate, setOpenDate] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");

        setUser(res.data);
        setSubjectCounts(res.data.subjects);
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
        const {
          totalStudents,
          // enrolledSubjects,
          upcomingClasses,
          previousClasses,
        } = res.data;

        setTotalStudents(totalStudents || 0);
        // setSubjectCounts(enrolledSubjects || {});
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
      console.log("Raw students data from API:", res.data);
      const rawStudents = res.data.students;
      setShowStudentModal(true);

      if (!Array.isArray(rawStudents) || rawStudents.length === 0) {
        console.log("No student data found");
        return;
      }

      const groupedStudents = rawStudents.reduce((acc, student) => {
        const date = student.selectedDate;
        const subject = student.courseId.name;
        const courseType = student.courseId.courseType;

        if (!acc[date]) acc[date] = {};

        if (!acc[date][subject]) acc[date][subject] = {};

        if (!acc[date][subject][courseType]) {
          acc[date][subject][courseType] = [];
        }

        acc[date][subject][courseType].push({
          studentName: student.user.name,
          studentEmail: student.user.email,
          timeSlot: student.selectedTime,
          status: student.status,
        });

        return acc;
      }, {});

      setStudents(groupedStudents);
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
                    <h3 className="text-lg font-semibold">
                      All Upcoming Classes
                    </h3>
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
                    <h3 className="text-lg font-semibold">
                      All Previous Classes
                    </h3>
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

          {showStudentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
              <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto relative">
                {/* Close button */}
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                  title="Close"
                >
                  &times;
                </button>

                {/* Header */}
                <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center border-b pb-2">
                  Enrolled Students
                </h3>

                {/* Grouped Student List */}
                {students && Object.keys(students).length === 0 ? (
                  <p className="text-gray-500 text-center">
                    No students found.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {Object.entries(
                      Object.fromEntries(
                        Object.entries(students).sort(([dateA], [dateB]) => {
                          const today = new Date().toISOString().split("T")[0];
                          const dA = new Date(dateA);
                          const dB = new Date(dateB);
                          const todayDate = new Date(today);

                          const getOrder = (date) => {
                            if (
                              date.toISOString().split("T")[0] ===
                              todayDate.toISOString().split("T")[0]
                            )
                              return 0; // today
                            if (date > todayDate) return 1; // upcoming
                            return 2; // past
                          };

                          const orderA = getOrder(dA);
                          const orderB = getOrder(dB);

                          if (orderA !== orderB) return orderA - orderB;
                          return dA - dB;
                        })
                      )
                    ).map(([date, subjects]) => {
                      const today = new Date().toISOString().split("T")[0];
                      const dateType =
                        date === today
                          ? "today"
                          : new Date(date) > new Date(today)
                          ? "upcoming"
                          : "past";

                      const bgColor =
                        dateType === "today"
                          ? "bg-green-50 border border-green-300"
                          : dateType === "upcoming"
                          ? "bg-blue-50 border border-blue-300"
                          : "bg-gray-100 border border-gray-300";

                      return (
                        <div
                          key={date}
                          className={`${bgColor} rounded-lg shadow-sm mb-4`}
                        >
                          {/* Toggle Button */}
                          <button
                            className="w-full text-left px-4 py-3 text-lg font-medium text-gray-800 hover:bg-gray-200 transition rounded-t-lg"
                            onClick={() =>
                              setOpenDate((prevDate) =>
                                prevDate === date ? null : date
                              )
                            }
                          >
                            {date}
                          </button>

                          {/* Expanded Details */}
                          {openDate === date && (
                            <div className="px-4 py-4 bg-white border-t border-gray-200 rounded-b-lg space-y-4">
                              {Object.entries(subjects).map(
                                ([subject, courseTypes]) => (
                                  <div key={subject}>
                                    <h5 className="text-md font-semibold text-gray-700 mb-2">
                                      {subject}
                                    </h5>

                                    {Object.entries(courseTypes).map(
                                      ([courseType, courseStudents]) => (
                                        <div key={courseType} className="ml-4">
                                          <h6 className="text-sm font-medium text-gray-600 mb-2">
                                            {courseType}
                                          </h6>

                                          <ul className="space-y-2">
                                            {courseStudents.map(
                                              (student, idx) => (
                                                <li
                                                  key={idx}
                                                  className="border rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition"
                                                >
                                                  <p>
                                                    <strong>Name:</strong>{" "}
                                                    {student.studentName}
                                                  </p>
                                                  <p>
                                                    <strong>Email:</strong>{" "}
                                                    {student.studentEmail}
                                                  </p>
                                                  <p>
                                                    <strong>Time Slot:</strong>{" "}
                                                    {student.timeSlot}
                                                  </p>
                                                  <p>
                                                    <strong>Status:</strong>{" "}
                                                    {student.status}
                                                  </p>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
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
