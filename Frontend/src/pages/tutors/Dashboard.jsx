import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import SidebarMobile from "./SidebarMobile";
import { ClipLoader } from "react-spinners";
import api from "../../components/User-management/api";

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [previousClasses, setPreviousClasses] = useState([]);
  const [subjectCounts, setSubjectCounts] = useState({});
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [user, setUser] = useState(null);
  const [openDate, setOpenDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [openStudent, setOpenStudent] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const res = await api.get(`/all-class`);
        if (res.data.success) {
          setAllStudents(res.data.students);
          console.log("ALL STUDENTS", res.data.students);
        }
      } catch (err) {
        console.error("Error fetching students", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents(); // ✅ Corrected function call
  }, []);

  const handleViewAllclasses = () => {
    setShowClassModal(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");

        setUser(res.data);
        setSubjectCounts(res.data.subjects);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
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
      } finally {
        setLoading(false);
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

  const handleViewSubjects = () => {
    setShowModal(true);
  };
  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
        <ClipLoader size={80} color="#FFA500" />
      </div>
    );

  console.log("previousClasses", previousClasses);
  const firstFive = upcomingClasses.slice(0, 5);
  const firstFivePrevious = previousClasses.slice(0, 5);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="absolute md:static top-0 left-0 z-50">
        <div className="max-md:hidden">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <SidebarMobile />
        </div>
      </div>

      <div className="w-full z-0 relative ml-0 ">
        <Navbar title="Dashboard" user={user} />

        <div className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-800">Total Students</h2>
              <p className="text-2xl mt-2 text-orange-600">{totalStudents}</p>
              <button
                onClick={fetchStudents}
                className="text-sm mt-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                View All
              </button>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Classes</h2>
              <p className="text-2xl mt-2 text-orange-600">{upcomingClasses.length}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-800">Total Classes</h2>
              <p className="text-2xl mt-2 text-orange-600">{Object.keys(allStudents).length}</p>
              <button
                className="text-sm mt-2 text-blue-600 hover:text-blue-800 transition-colors"
                onClick={handleViewAllclasses}
              >
                View
              </button>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-800">Subjects You Teach</h2>
              <p className="text-2xl mt-2 text-orange-600">
                {Object.keys(subjectCounts).length}
              </p>
              <button
                className="text-sm mt-2 text-blue-600 hover:text-blue-800 transition-colors"
                onClick={handleViewSubjects}
              >
                View
              </button>
            </div>
          </div>

          {/* Upcoming Classes Section */}
          <div className="mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Classes</h2>
              {upcomingClasses.length === 0 ? (
                <p className="text-gray-600">No upcoming classes scheduled.</p>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {firstFive.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.studentName}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.subject}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.time}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              {upcomingClasses.length > 5 && (
                <button
                  onClick={() => setShowUpcomingModal(true)}
                  className="mt-4 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View All
                </button>
              )}
            </div>
          </div>

          {/* Previous Classes Section */}
          <div className="mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Previous Classes</h2>
              {previousClasses.length === 0 ? (
                <p className="text-gray-600">No previous classes recorded.</p>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {firstFivePrevious.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.studentName}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.subject}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.time}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              {previousClasses.length > 5 && (
                <button
                  onClick={() => setShowUpcomingModal(true)}
                  className="mt-4 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View All
                </button>
              )}
            </div>
          </div>

          {showClassModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 sm:p-8">
                {/* Close Button */}
                <button
                  onClick={() => setShowClassModal(false)}
                  className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-3xl font-bold transition"
                  title="Close"
                >
                  &times;
                </button>

                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-md px-6 py-3 rounded-2xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                      All Enrolled Students
                    </h3>
                  </div>
                </div>

                {/* Group Students by Name */}
                <div className="space-y-4">
                  {allStudents.length === 0 ? (
                    <p className="text-gray-500 text-center">
                      No students found.
                    </p>
                  ) : (
                    Object.entries(
                      allStudents.reduce((acc, student) => {
                        // Group students by name
                        if (!acc[student.studentName]) {
                          acc[student.studentName] = [];
                        }
                        acc[student.studentName].push(student);
                        return acc;
                      }, {})
                    ).map(([name, students]) => (
                      <div
                        key={name}
                        className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm transition-all"
                      >
                        {/* Student Name Toggle */}
                        <button
                          className="w-full flex items-center justify-between px-5 py-4 text-lg font-medium text-gray-800 hover:bg-white transition rounded-t-xl"
                          onClick={() =>
                            setOpenStudent((prev) =>
                              prev === name ? null : name
                            )
                          }
                        >
                          <span>{name}</span>
                          <span className="text-xl">
                            {openStudent === name ? "−" : "+"}
                          </span>
                        </button>

                        {/* Expandable Details */}
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            openStudent === name
                              ? "max-h-screen opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="bg-white px-6 py-4 rounded-b-xl border-t border-gray-200">
                            <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                              {students.map((student, idx) => (
                                <div
                                  key={idx}
                                  className="grid sm:grid-cols-2 gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                                >
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase">
                                      Email
                                    </p>
                                    <p className="text-gray-800 font-medium break-words">
                                      {student.studentEmail}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase">
                                      Date
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                      {student.selectedDate}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase">
                                      Time Slot
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                      {student.timeSlot}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase">
                                      Course
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                      {student.courseName}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase">
                                      Type
                                    </p>
                                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                                      {student.courseType}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase">
                                      Status
                                    </p>
                                    <span
                                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                        student.status === "completed"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-yellow-100 text-yellow-700"
                                      }`}
                                    >
                                      {student.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
              <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-6h13M9 5v.01M3 6v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    Subjects You Teach
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-red-500 transition duration-200 text-xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="mt-4 max-h-60 overflow-y-auto">
                  {user?.subjects?.length ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {user.subjects.map((subject, idx) => (
                        <li
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm border border-blue-100"
                        >
                          {subject}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No subjects assigned yet.</p>
                  )}
                </div>

                <div className="mt-6 text-right">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

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

          {showStudentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 sm:p-8">
                {/* Close Button */}
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-3xl font-bold transition"
                  title="Close"
                >
                  &times;
                </button>

                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-md px-6 py-3 rounded-2xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M4 4v16c0 1.104.896 2 2 2h4m4 0h4c1.104 0 2-.896 2-2V4m-6 0v16M9 4v16"
                      />
                    </svg>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                      Enrolled Students
                    </h3>
                  </div>
                </div>

                {/* Student Sections */}
                {students && Object.keys(students).length === 0 ? (
                  <p className="text-gray-500 text-center">
                    No students found.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {Object.entries(
                      Object.fromEntries(
                        Object.entries(students).sort(([dateA], [dateB]) => {
                          const today = new Date().toISOString().split("T")[0];
                          const dA = new Date(dateA);
                          const dB = new Date(dateB);
                          const todayDate = new Date(today);

                          const getOrder = (date) => {
                            if (date.toISOString().split("T")[0] === today)
                              return 0;
                            if (date > todayDate) return 1;
                            return 2;
                          };

                          return getOrder(dA) - getOrder(dB) || dA - dB;
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

                      const borderColor =
                        dateType === "today"
                          ? "border-green-400"
                          : dateType === "upcoming"
                          ? "border-blue-400"
                          : "border-gray-300";

                      const bgGradient =
                        dateType === "today"
                          ? "bg-gradient-to-r from-green-50 to-green-100"
                          : dateType === "upcoming"
                          ? "bg-gradient-to-r from-blue-50 to-blue-100"
                          : "bg-gradient-to-r from-gray-100 to-gray-200";

                      return (
                        <div
                          key={date}
                          className={`rounded-xl border-l-4 ${borderColor} shadow-sm ${bgGradient}`}
                        >
                          <button
                            className="w-full flex items-center justify-between px-5 py-4 text-lg font-semibold text-gray-700 hover:bg-white/50 rounded-t-xl transition"
                            onClick={() =>
                              setOpenDate((prevDate) =>
                                prevDate === date ? null : date
                              )
                            }
                          >
                            <span>{date}</span>
                            <span className="text-xl">
                              {openDate === date ? "−" : "+"}
                            </span>
                          </button>

                          {/* Expandable Content */}
                          <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              openDate === date
                                ? "max-h-screen opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="bg-white px-6 py-5 space-y-5 rounded-b-xl border-t border-gray-200">
                              {Object.entries(subjects).map(
                                ([subject, courseTypes]) => (
                                  <div key={subject}>
                                    <h4 className="text-md font-semibold text-gray-800 mb-2">
                                      📘 {subject}
                                    </h4>

                                    {Object.entries(courseTypes).map(
                                      ([courseType, courseStudents]) => (
                                        <div
                                          key={courseType}
                                          className="ml-3 mb-4"
                                        >
                                          <h5 className="text-sm font-medium text-gray-600 mb-2">
                                            {courseType}
                                          </h5>

                                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {courseStudents.map(
                                              (student, idx) => (
                                                <div
                                                  key={idx}
                                                  className="bg-gray-50 hover:bg-gray-100 border rounded-xl p-4 shadow-sm transition-all"
                                                >
                                                  <p className="text-gray-800">
                                                    <strong>Name:</strong>{" "}
                                                    <span className="break-all">
                                                      {student.studentName}
                                                    </span>
                                                  </p>
                                                  <p className="text-gray-600 break-words whitespace-normal overflow-hidden">
                                                    <strong>Email:</strong>{" "}
                                                    <span className="break-all">
                                                      {student.studentEmail}
                                                    </span>
                                                  </p>

                                                  <p className="text-gray-600">
                                                    <strong>Time Slot:</strong>{" "}
                                                    {student.timeSlot}
                                                  </p>
                                                  <p className="text-gray-600">
                                                    <strong>Status:</strong>{" "}
                                                    {student.status}
                                                  </p>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
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
