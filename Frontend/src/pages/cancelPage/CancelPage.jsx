
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../components/User-management/api";

const CancelPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get("transactionId");
  const [loading, setLoading] = useState(true);
  const [courseId, setCourseId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!transactionId) {
        setError("No transaction ID found.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/status/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.courseId) {
          setCourseId(response.data.courseId);

          setTimeout(() => {
            navigate(`/courses/${response.data.courseId}`);
          }, 5000);
        }
      } catch (err) {
        setError("Error fetching transaction details.");
        console.error("Error fetching transaction:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [transactionId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-center p-5">
      <h1 className="text-3xl font-bold text-red-600">Payment Canceled</h1>
      <p className="text-gray-700 mt-2">Your payment was not completed.</p>

      {loading ? (
        <p className="text-gray-500 mt-2">Verifying transaction...</p>
      ) : error ? (
        <p className="text-red-500 mt-2">{error}</p>
      ) : (
        <p className="text-gray-500 mt-2">
          Redirecting you back to the course page...
        </p>
      )}

      {courseId && (
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          Go to Course
        </button>
      )}
    </div>
  );
};

export default CancelPage;