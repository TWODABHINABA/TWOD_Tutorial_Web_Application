import React, { useEffect, useState } from "react";
import api from "../../components/User-management/api";
import Sidebar from "./Sidebar";
import SidebarMobile from "./SidebarMobile";
import Navbar from "./Navbar";
import { ClipLoader } from "react-spinners";

const SendAssignment = () => {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedAssignments, setSelectedAssignments] = useState({});

  //   const today = new Date().toISOString().split("T")[0];
  const fetchAssignments = async () => {
    try {
      const res = await api.get("/get-assignments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setAssignments(res.data.assignments);
      }
    } catch (err) {
      console.error("Failed to fetch assignments", err);
    }
  };
  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const getGroupKey = ({ date, subject, grade }) =>
    `${date}__${subject}__${grade}`;

  const handleAttachClick = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  const handleSelectAssignment = (assignment) => {
    const key = getGroupKey(selectedGroup);
    setSelectedAssignments((prev) => ({
      ...prev,
      [key]: assignment,
    }));
    setShowModal(false);
  };

  const handleSendAssignments = () => {
    const toSend = Object.entries(selectedAssignments).map(
      ([key, assignment]) => {
        const [date, subject, grade] = key.split("__");
        return { date, subject, grade, assignmentId: assignment._id };
      }
    );

    // Send `toSend` array to backend here via axios/fetch
    console.log("Sending assignments to backend:", toSend);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/assignments/students"); // No date query
        if (res.data.success) {
          setGroupedData(res.data.grouped);
        }
        console.log("Grouped Data", groupedData);
      } catch (err) {
        console.error("Error fetching assignment data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
        <ClipLoader size={80} color="#FFA500" />
      </div>
    );

  return (
    <div className="flex bg-gray-50 min-h-screen">
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
        <Navbar title="Dashboard" user={user} />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Assignment Groups</h1>

          {Object.entries(groupedData).map(([date, subjects]) => (
            <div
              key={date}
              className="mb-6 border rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold mb-4">{date}</h2>

              {Object.entries(subjects).map(([subject, grades]) =>
                Object.entries(grades).map(([grade, students]) => {
                  const key = getGroupKey({ date, subject, grade });
                  const selectedAssignment = selectedAssignments[key];

                  return (
                    <div
                      key={key}
                      className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">
                          {subject} - Grade: {grade}
                        </h3>
                        <button
                          className={`text-sm px-3 py-1 rounded ${
                            selectedAssignment
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                          onClick={() =>
                            handleAttachClick({ date, subject, grade })
                          }
                        >
                          {selectedAssignment
                            ? `${selectedAssignment.courseName} - ${selectedAssignment.courseType} (Click to change)`
                            : "Attach Assignment"}
                        </button>
                      </div>
                      <ul className="list-disc list-inside ml-4">
                        {students.map((student, index) => (
                          <li key={index}>
                            {student.studentName} - {student.email} (
                            {student.timeSlot})
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })
              )}
            </div>
          ))}

          {Object.keys(selectedAssignments).length > 0 && (
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleSendAssignments}
              >
                Send
              </button>
            </div>
          )}
        </div>

        {/* Popup Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                Select an Assignment
              </h2>
              {assignments.length === 0 ? (
                <p>No assignments found.</p>
              ) : (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {assignments.map((assignment) => (
                    <li
                      key={assignment._id}
                      className="border p-3 rounded hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectAssignment(assignment)}
                    >
                      <h3 className="font-medium">
                        {assignment.courseName} - {assignment.courseType}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {assignment.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        Questions: {assignment.questions.length}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-end mt-4">
                <button
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendAssignment;

// <div className="flex bg-gray-50 min-h-screen">
//   {/* Sidebar */}
//   <div className="absolute md:static top-0 left-0 z-50">
//     <div className="max-md:hidden">
//       <Sidebar />
//     </div>
//     <div className="md:hidden">
//       <SidebarMobile />
//     </div>
//   </div>

//   {/* Main Content */}
//   <div className="w-full z-0 relative">
//     <Navbar title="Dashboard" user={user} />

//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Assignment Groups</h1>

//       {Object.entries(groupedData).map(([date, subjects]) => (
//         <div
//           key={date}
//           className="mb-6 border rounded-lg p-4 shadow-sm bg-white"
//         >
//           <h2 className="text-xl font-semibold mb-4">{date}</h2>

//           {/* Loop through subjects and then grades */}
//           {Object.entries(subjects).map(([subject, grades]) =>
//             Object.entries(grades).map(([grade, students]) => (
//               <div
//                 key={`${subject}-${grade}`}
//                 className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4"
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="text-lg font-semibold">
//                     {subject} - Grade: {grade}
//                   </h3>
//                   <button
//                     className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
//                     onClick={() =>
//                       handleAttachClick({ date, subject, grade })
//                     }
//                   >
//                     Attach Assignment
//                   </button>
//                 </div>
//                 <ul className="list-disc list-inside ml-4">
//                   {students.map((student, index) => (
//                     <li key={index}>
//                       {student.studentName} - {student.email} (
//                       {student.timeSlot})
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))
//           )}
//         </div>
//       ))}
//     </div>

//     {/* Popup Modal */}
//     {showModal && (
//       <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//         <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-lg">
//           <h2 className="text-lg font-semibold mb-4">
//             Select an Assignment
//           </h2>
//           {assignments.length === 0 ? (
//             <p>No assignments found.</p>
//           ) : (
//             <ul className="space-y-2 max-h-60 overflow-y-auto">
//               {assignments.map((assignment) => (
//                 <li
//                   key={assignment._id}
//                   className="border p-3 rounded hover:bg-gray-100 cursor-pointer"
//                   onClick={() => handleSelectAssignment(assignment)}
//                 >
//                   <h3 className="font-medium">
//                     {assignment.courseName} - {assignment.courseType}
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     {assignment.description}
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     Questions: {assignment.questions.length}
//                   </p>
//                 </li>
//               ))}
//             </ul>
//           )}
//           <div className="flex justify-end mt-4">
//             <button
//               className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//               onClick={() => setShowModal(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     )}
//   </div>
// </div>
