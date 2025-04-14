// import React from "react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../../components/navbar/Navbar";
// import api from "../../components/User-management/api";
// import Footer from "../../components/footer/Footer";
// import { ClipLoader } from "react-spinners";
// const PurchasedCourse = () => {
//   const [purchasedCourses, setPurchasedCourses] = useState([]);
//   const isAdmin = localStorage.getItem("role");
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 800);

//     return () => clearTimeout(timer);
//   }, []);
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     console.log("Token in localStorage:", token);
//     if (!token) {
//       navigate("/");
//       return;
//     }

//     const fetchPurchasedCourses = async () => {
//       if (isAdmin === "admin") {
//         setPurchasedCourses("");
//       }
//       try {
//         const response = await api.get("/user/courses");
//         setPurchasedCourses(response.data);
//         console.log(response.data);
//       } catch (err) {
//         console.error("Error fetching purchased courses:", err);
//       }
//     };

//     fetchPurchasedCourses();
//   }, [navigate]);
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
//               {purchasedCourses.map((course) => (
//                 <li
//                   key={course._id}
//                   className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border hover:border-orange-400 transition duration-300 cursor-pointer"
//                 >
//                   <h1 className="text-2xl font-bold text-orange-800 mb-2">
//                     {course.courseTypeTitle}
//                   </h1>
//                   <h3 className="text-xl font-semibold text-orange-500">
//                     {course.courseTitle}
//                   </h3>
//                   <p className="text-lg text-green-600 mt-2">
//                     Price Paid: ${course.amountPaid}
//                   </p>

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






import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import api from "../../components/User-management/api";
import Footer from "../../components/footer/Footer";
import { ClipLoader } from "react-spinners";

const PurchasedCourse = () => {
  const token = localStorage.getItem("token");
  const [purchasedCourses, setPurchasedCourses] = useState([]);
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
        setPurchasedCourses(response.data);
      } catch (err) {
        console.error("Error fetching purchased courses:", err);
      }
    };

    fetchPurchasedCourses();
    const interval = setInterval(fetchPurchasedCourses, 5000);

    return () => clearInterval(interval);
  }, [navigate, isAdmin]);



  const handlePayNow = async (tid) => {
    console.log(tid);
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
        <div className="max-w-6xl mx-auto mt-12 bg-orange-50 rounded-3xl shadow-lg p-8 border border-orange-200">
          <div className="text-3xl font-bold text-orange-700 mb-6 cursor-pointer">
            🎓 Purchased Courses
          </div>

          {purchasedCourses.length > 0 ? (
            <ul className="space-y-8 pt-6">
              {purchasedCourses.map((course, index) => (
                <li
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border hover:border-orange-400 transition duration-300 cursor-pointer"
                >
                  <h1 className="text-2xl font-bold text-orange-800 mb-2">
                    {course.courseTypeTitle}
                  </h1>
                  <h3 className="text-xl font-semibold text-orange-500">
                    {course.courseTitle}
                  </h3>
                  <p className="text-lg text-green-600 mt-2">
                    {course.type === "accepted" && `Price to be Paid: $${course.amountPaid}`}
                    {course.type === "failed" && `Price to be Paid: $${course.amountPaid}`}
                    {course.type === "completed" && `Price Paid: $${course.amountPaid}`}
                    {course.type === "pending for tutor acceptance" && `Amount: $${course.amountPaid}`}
                  </p>
                  <p className="text-sm mt-1 text-gray-600 italic">
                    Status:{" "}
                    {course.type === "failed" ? (
                      <span className="font-semibold text-red-600">
                        Your previous payment failed. Please try again.
                      </span>
                    ) : (
                      <span
                        className={`font-semibold ${course.type === "completed"
                            ? "text-green-700"
                            : "text-yellow-600"
                          }`}
                      >
                        {course.type}
                      </span>
                    )}
                  </p>



                  {(course.type === "accepted" || course.type === "failed") && (
                    <div className="mt-4">
                      <button
                        onClick={() => handlePayNow(course.tid)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-xl shadow transition duration-200"
                      >
                        Pay Now
                      </button>
                    </div>
                  )}

                  <div className="mt-4 bg-orange-100 p-4 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-gray-800 underline decoration-orange-400 mb-3">
                      Session Details:
                    </h4>
                    <p>
                      <strong>Tutor:</strong> {course.tutorName}
                    </p>
                    <p>
                      <strong>Date:</strong> {course.selectedDate}
                    </p>
                    <p>
                      <strong>Time:</strong> {course.selectedTime}
                    </p>
                    <p>
                      <strong>Duration:</strong> {course.duration}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center text-lg py-8">
              No purchased courses found.
            </p>
          )}
        </div>
      )}
      <Footer />
    </>
  );
};

export default PurchasedCourse;
