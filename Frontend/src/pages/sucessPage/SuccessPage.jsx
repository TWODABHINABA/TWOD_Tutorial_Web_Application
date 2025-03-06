// import React, { useEffect,useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { FaCheckCircle } from "react-icons/fa";

// const SuccessPage = () => {
//   const [searchParams] = useSearchParams();
//   const transactionId = searchParams.get("transactionId");
//   const paymentId = searchParams.get("paymentId");
//   const navigate = useNavigate();
//   const [status, setStatus] = useState("pending");

//   useEffect(() => {
//     // Redirect to courses page after 5 seconds

//     setStatus("completed");
//     const timer = setTimeout(() => {
//       navigate("/user");
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [navigate]);

//   return (
//     <div style={styles.container}>
//       <FaCheckCircle style={styles.icon} />
//       <h2 style={styles.heading}>Payment Successful!</h2>
//       <p style={styles.message}>
//         Your enrollment is confirmed. Transaction ID: <strong>{transactionId}</strong>
//       </p>
//       <p style={styles.redirect}>Redirecting to courses in 5 seconds...</p>
//     </div>
//   );
// };

// // Simple inline styles
// const styles = {
//   container: {
//     textAlign: "center",
//     marginTop: "10vh",
//   },
//   icon: {
//     fontSize: "80px",
//     color: "green",
//   },
//   heading: {
//     fontSize: "24px",
//     fontWeight: "bold",
//     marginTop: "20px",
//   },
//   message: {
//     fontSize: "18px",
//     marginTop: "10px",
//   },
//   redirect: {
//     fontSize: "16px",
//     marginTop: "20px",
//     color: "gray",
//   },
// };

// export default SuccessPage;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle } from "lucide-react"; // Icon for success UI
import api from "../../components/User-management/api";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const verifyPayment = async () => {
      const queryParams = new URLSearchParams(location.search);
      const transactionId = queryParams.get("transactionId");
      const paymentId = queryParams.get("paymentId");
      const payerId = queryParams.get("PayerID");

      if (!transactionId || !paymentId || !payerId) {
        setStatus("failed");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/success?transactionId=${transactionId}&paymentId=${paymentId}&PayerID=${payerId}`,
          { withCredentials: true }
          
        );

        if (response.data.success) {
          setStatus("completed");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {loading ? (
        <div className="text-xl font-semibold text-gray-700">🔄 Verifying Payment...</div>
      ) : status === "completed" ? (
        <div className="text-center">
          <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
          <p className="text-gray-700">You have been successfully enrolled in the course.</p>
          <button
            onClick={() => navigate(`/user`)}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Go to Courses
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Payment Failed!</h2>
          <p className="text-gray-700">Something went wrong. Please try again.</p>
          <button
            onClick={() => navigate("/user")}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Return to Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
