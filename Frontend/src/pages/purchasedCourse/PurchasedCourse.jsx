import React from "react";
import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import api from "../../components/User-management/api";
import Footer from "../../components/footer/Footer";
const PurchasedCourse = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const isAdmin = localStorage.getItem("role");
  const navigate=useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", token);
    if (!token) {
      navigate("/");
      return;
    }

    const fetchPurchasedCourses = async () => {
      if (isAdmin === "admin") {
        setPurchasedCourses("");
      }
      try {
        const response = await api.get("/user/courses");
        setPurchasedCourses(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching purchased courses:", err);
      }
    };

    fetchPurchasedCourses();
  }, [navigate]);
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
                {purchasedCourses.map((course) => (
                  <li
                    key={course._id}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border hover:border-orange-400 transition duration-300 cursor-pointer"
                  >
                    <h1 className="text-2xl font-bold text-orange-800 mb-2">
                      {course.courseTypeTitle}
                    </h1>
                    <h3 className="text-xl font-semibold text-orange-500">
                      {course.courseTitle}
                    </h3>
                    <p className="text-lg text-green-600 mt-2">
                      Price Paid: ${course.amountPaid}
                    </p>

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
