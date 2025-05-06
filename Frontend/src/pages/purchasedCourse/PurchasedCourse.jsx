import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import api from "../../components/User-management/api";
import Footer from "../../components/footer/Footer";
import { ClipLoader } from "react-spinners";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const PurchasedCourse = () => {
  const token = localStorage.getItem("token");
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isAdmin = localStorage.getItem("role");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchPurchasedCourses = async () => {
      if (isAdmin === "admin") {
        setPurchasedCourses([]);
        return;
      }

      try {
        const response = await api.get("/user/courses");
        const coursesWithStatus = response.data.map(course => {
          const [year, month, day] = course.selectedDate.split('-');
          const [startTime] = course.selectedTime.split('-');
          const [time, period] = startTime.trim().split(' ');
          let [hours, minutes] = time.split(':');
          
          if (period === 'PM' && hours !== '12') {
            hours = parseInt(hours) + 12;
          } else if (period === 'AM' && hours === '12') {
            hours = '00';
          }
          
          const courseDateTime = new Date(year, month - 1, day, hours, minutes);
          const currentDateTime = new Date();
          
          return {
            ...course,
            isDone: currentDateTime > courseDateTime,
            courseDate: new Date(year, month - 1, day)
          };
        });
        setPurchasedCourses(coursesWithStatus);
      } catch (err) {
        console.error("Error fetching purchased courses:", err);
      }
    };

    fetchPurchasedCourses();
    const interval = setInterval(fetchPurchasedCourses, 5000);

    return () => clearInterval(interval);
  }, [navigate, isAdmin]);

  const handlePayNow = async (tid) => {
    try {
      const { data } = await api.post(
        `/payLater/${tid}/payNow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.approval_url) {
        window.location.href = data.approval_url;
      } else {
        alert("Payment URL not received.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Payment failed.");
    }
  };

  const handleBookAgain = (course) => {
    navigate(`/courses/${course.courseId}`, {
      state: {
        showEnrollModal: true,
        prefillData: {
          tutorName: course.tutorName,
          selectedDate: course.selectedDate,
          selectedTime: course.selectedTime.split('-')[0].trim(),
          duration: course.duration,
          courseType: course.courseTypeTitle,
          grade: course.courseTitle,
          subject: course.courseTypeTitle,
          tutorId: course.tutorId
        }
      }
    });
  };

  const filteredCourses = purchasedCourses.filter(course => {
    const courseDate = new Date(course.selectedDate);
    return courseDate.toDateString() === selectedDate.toDateString();
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={80} color="#FFA500" />
      </div>
    );

  return (
    <>
      <Navbar />
      {isAdmin !== "admin" && (
        <div className="max-w-6xl mx-auto mt-12 bg-orange-50 rounded-3xl shadow-lg p-8 border border-orange-200 mb-7">
          <div className="text-3xl font-bold text-orange-700 mb-6">
            🎓 My Course Schedule
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-orange-800 mb-4">Select Date</h2>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="w-full border-none"
                tileClassName={({ date }) => {
                  const hasCourse = purchasedCourses.some(
                    course => new Date(course.selectedDate).toDateString() === date.toDateString()
                  );
                  return hasCourse ? 'text-green-500 font-bold' : '';
                }}
              />
            </div>

            {/* Courses Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-orange-800 mb-4">
                Courses on {selectedDate.toLocaleDateString()}
              </h2>
              
              {filteredCourses.length > 0 ? (
                <div className="space-y-4">
                  {filteredCourses.map((course, index) => (
                    <div
                      key={index}
                      className="bg-orange-50 p-4 rounded-xl border border-orange-200 hover:border-orange-400 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-orange-800">
                            {course.courseTypeTitle}
                          </h3>
                          <p className="text-md text-orange-600">
                            {course.courseTitle}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600">
                            {course.type === "accepted" && `$${course.amountPaid}`}
                            {course.type === "failed" && `$${course.amountPaid}`}
                            {course.type === "completed" && `$${course.amountPaid}`}
                            {course.type === "pending for tutor acceptance" && `$${course.amountPaid}`}
                          </p>
                          <p className={`text-xs font-medium ${
                            course.type === "failed" ? "text-red-600" :
                            course.type === "completed" ? "text-green-700" : "text-yellow-600"
                          }`}>
                            {course.type === "failed" ? "Payment Failed" : course.type}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">Tutor:</span> {course.tutorName}</p>
                          <p><span className="font-medium">Time:</span> {course.selectedTime}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Duration:</span> {course.duration}</p>
                          <p><span className="font-medium">Date:</span> {course.selectedDate}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {(course.type === "accepted" || course.type === "failed") && (
                          <button
                            onClick={() => handlePayNow(course.tid)}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-1 px-3 rounded-lg shadow transition duration-200"
                          >
                            Pay Now
                          </button>
                        )}
                        
                        {course.isDone && (
                          <button
                            onClick={() => handleBookAgain(course)}
                            className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1 px-3 rounded-lg shadow transition duration-200"
                          >
                            Book Again
                          </button>
                        )}
                      </div>

                      {course.assignments?.length > 0 && (
                        <div className="mt-3 bg-blue-50 p-2 rounded-lg border border-blue-200">
                          <h4 className="text-sm font-semibold text-blue-800 mb-1">
                            Assignments:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {course.assignments.map((assignment) => (
                              <div
                                key={assignment.assignmentId}
                                onClick={() => navigate(`/assignment-view/${assignment.assignmentId}`)}
                                className="bg-white px-2 py-1 rounded border border-blue-300 hover:bg-blue-100 cursor-pointer transition duration-200"
                              >
                                <p className="text-xs font-medium text-gray-800">
                                  {assignment.subject}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {assignment.grade}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No courses scheduled for this date.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default PurchasedCourse;
















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../../components/navbar/Navbar";
// import api from "../../components/User-management/api";
// import Footer from "../../components/footer/Footer";
// import { ClipLoader } from "react-spinners";

// const PurchasedCourse = () => {
//   const token = localStorage.getItem("token");
//   const [purchasedCourses, setPurchasedCourses] = useState([]);
//   const isAdmin = localStorage.getItem("role");
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 800);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/");
//       return;
//     }

//     const fetchPurchasedCourses = async () => {
//       if (isAdmin === "admin") {
//         setPurchasedCourses([]);
//         return;
//       }

//       try {
//         const response = await api.get("/user/courses");
//         const coursesWithStatus = response.data.map(course => {
//           const [year, month, day] = course.selectedDate.split('-');
//           const [startTime] = course.selectedTime.split('-');
//           const [time, period] = startTime.trim().split(' ');
//           let [hours, minutes] = time.split(':');
          
//           if (period === 'PM' && hours !== '12') {
//             hours = parseInt(hours) + 12;
//           } else if (period === 'AM' && hours === '12') {
//             hours = '00';
//           }
          
//           const courseDateTime = new Date(year, month - 1, day, hours, minutes);
//           const currentDateTime = new Date();
          
//           return {
//             ...course,
//             isDone: currentDateTime > courseDateTime
//           };
//         });
//         setPurchasedCourses(coursesWithStatus);
//         console.log(coursesWithStatus);
//       } catch (err) {
//         console.error("Error fetching purchased courses:", err);
//       }
//     };

//     fetchPurchasedCourses();
//     const interval = setInterval(fetchPurchasedCourses, 5000);

//     return () => clearInterval(interval);
//   }, [navigate, isAdmin]);

//   const handlePayNow = async (tid) => {
//     console.log(tid);
//     try {
//       const { data } = await api.post(
//         `/payLater/${tid}/payNow`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.approval_url) {
//         window.location.href = data.approval_url;
//       } else {
//         alert("Payment URL not received.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Payment failed.");
//     }
//   };

//   const handleBookAgain = (course) => {
//     console.log("Booking again with course data:", course);
    
//     navigate(`/courses/${course.courseId}`, {
//       state: {
//         showEnrollModal: true,
//         prefillData: {
//           tutorName: course.tutorName,
//           selectedDate: course.selectedDate,
//           selectedTime: course.selectedTime.split('-')[0].trim(),
//           duration: course.duration,
//           courseType: course.courseTypeTitle,
//           grade: course.courseTitle,
//           subject: course.courseTypeTitle,
//           tutorId: course.tutorId
//         }
//       }
//     });
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <ClipLoader size={80} color="#FFA500" />
//       </div>
//     );

//   return (
//     <>
//       <Navbar />
//       {isAdmin !== "admin" && (
//         <div className="max-w-6xl mx-auto mt-12 bg-orange-50 rounded-3xl shadow-lg p-8 border border-orange-200">
//           <div className="text-3xl font-bold text-orange-700 mb-6 cursor-pointer">
//             🎓 Purchased Courses
//           </div>

//           {purchasedCourses.length > 0 ? (
//             <ul className="space-y-8 pt-6">
//               {purchasedCourses.map((course, index) => (
//                 <li
//                   key={index}
//                   className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border hover:border-orange-400 transition duration-300 cursor-pointer"
//                 >
//                   <h1 className="text-2xl font-bold text-orange-800 mb-2">
//                     {course.courseTypeTitle}
//                   </h1>
//                   <h3 className="text-xl font-semibold text-orange-500">
//                     {course.courseTitle}
//                   </h3>
//                   <p className="text-lg text-green-600 mt-2">
//                     {course.type === "accepted" &&
//                       `Price to be Paid: $${course.amountPaid}`}
//                     {course.type === "failed" &&
//                       `Price to be Paid: $${course.amountPaid}`}
//                     {course.type === "completed" &&
//                       `Price Paid: $${course.amountPaid}`}
//                     {course.type === "pending for tutor acceptance" &&
//                       `Amount: $${course.amountPaid}`}
//                   </p>
//                   <p className="text-sm mt-1 text-gray-600 italic">
//                     Status:{" "}
//                     {course.type === "failed" ? (
//                       <span className="font-semibold text-red-600">
//                         Your previous payment failed. Please try again.
//                       </span>
//                     ) : (
//                       <span
//                         className={`font-semibold ${
//                           course.type === "completed"
//                             ? "text-green-700"
//                             : "text-yellow-600"
//                         }`}
//                       >
//                         {course.type}
//                       </span>
//                     )}
//                   </p>

//                   {(course.type === "accepted" || course.type === "failed") && (
//                     <div className="mt-4">
//                       <button
//                         onClick={() => handlePayNow(course.tid)}
//                         className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-xl shadow transition duration-200"
//                       >
//                         Pay Now
//                       </button>
//                     </div>
//                   )}

//                   <div className="mt-4 bg-orange-100 p-4 rounded-xl border border-orange-200">
//                     <h4 className="font-semibold text-gray-800 underline decoration-orange-400 mb-3">
//                       Session Details:
//                     </h4>
//                     <p>
//                       <strong>Tutor:</strong> {course.tutorName}
//                     </p>
//                     <p>
//                       <strong>Date:</strong> {course.selectedDate}
//                     </p>
//                     <p>
//                       <strong>Time:</strong> {course.selectedTime}
//                     </p>
//                     <p>
//                       <strong>Duration:</strong> {course.duration}
//                     </p>
//                   </div>

//                   {course.isDone && (
//                     <div className="mt-4">
//                       <button
//                         onClick={() => handleBookAgain(course)}
//                         className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl shadow transition duration-200"
//                       >
//                         Book Again
//                       </button>
//                     </div>
//                   )}

//                   {/* ✅ Assignment Section */}
//                   {course.assignments?.length > 0 && (
//                     <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-200">
//                       <h4 className="font-semibold text-blue-800 underline mb-2">
//                         Assignments:
//                       </h4>
//                       <ul className="space-y-2">
//                         {course.assignments.map((assignment) => (
//                           <li
//                             key={assignment.assignmentId}
//                             onClick={() =>
//                               navigate(
//                                 `/assignment-view/${assignment.assignmentId}`
//                               )
//                             }
//                             className="p-2 bg-white border border-blue-300 rounded-lg hover:bg-blue-100 cursor-pointer transition duration-200"
//                           >
//                             <p className="text-md font-medium text-gray-800">
//                               {assignment.subject}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               {assignment.grade}
//                             </p>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500 text-center text-lg py-8">
//               No purchased courses found.
//             </p>
//           )}
//         </div>
//       )}
//       <Footer />
//     </>
//   );
// };

// export default PurchasedCourse;

