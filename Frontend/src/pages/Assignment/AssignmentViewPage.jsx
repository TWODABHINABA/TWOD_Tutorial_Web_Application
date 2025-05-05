import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../components/User-management/api";
import Modal from "../login_signup/Modal";
import CustomNavbar from "../../components/navbar/Navbar";
import CustomFooter from "../../components/footer/Footer";
import { ClipLoader } from "react-spinners";

const AssignmentViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        sessionStorage.setItem(
          "redirectAfterLogin",
          window.location.pathname + window.location.search
        );
        setShowLoginModal(true);
        return;
      }

      try {
        const res = await api.get(`/get-assignment/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setAssignment(res.data.assignment);
        } else {
          setError(res.data.message || "Access denied.");
        }
      } catch (err) {
        console.error(err);
        setError(
          "Access denied or you are not authorized to view this assignment."
        );
      }
    };

    fetchAssignment();
  }, [id, navigate]);

  if (showLoginModal) {
    return (
      <Modal initialAction="Login" onClose={() => setShowLoginModal(false)} />
    );
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  if (!assignment)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
        <ClipLoader size={80} color="#FFA500" />
      </div>
    );

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  if (!assignment) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
        <ClipLoader size={80} color="#FFA500" />
      </div>
    );
  }

  const totalMarks = assignment.questions?.reduce(
    (sum, q) => sum + (q.number || 0),
    0
  );

  return (
    <>
      <CustomNavbar />
      <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded relative">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">{assignment.courseName}</h1>
          <span className="text-lg font-semibold text-gray-700">
            Total Marks: {totalMarks}
          </span>
        </div>
        <p className="text-lg">
          <strong>Subject:</strong> {assignment.courseType}
        </p>
        <p className="text-md mb-4">
          <strong>Description:</strong>{" "}
          {assignment.description || "No description provided"}
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">Assignment Questions</h2>
          {assignment.questions && assignment.questions.length > 0 ? (
            <ul className="space-y-4">
              {assignment.questions.map((q, index) => (
                <li key={q._id} className="p-4 border rounded bg-gray-50">
                  <p>
                    <strong>Q{index + 1}:</strong> {q.text}
                  </p>
                  <p className="italic text-sm text-gray-600">
                    Marks: {q.number}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No questions available.</p>
          )}
        </div>
        {showLoginModal && (
          <Modal
            initialAction="Login"
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </div>
      <CustomFooter/>
    </>
  );
};

export default AssignmentViewPage;
