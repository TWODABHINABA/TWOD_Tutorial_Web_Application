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
  const [answers, setAnswers] = useState({});
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showTextArea, setShowTextArea] = useState({});

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

  const handleAnswerClick = (questionId) => {
    setShowTextArea(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleAttach = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    setShowTextArea(prev => ({
      ...prev,
      [questionId]: false
    }));
  };

  const handleEdit = (questionId) => {
    setEditingQuestion(questionId);
    setShowTextArea(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleSubmitAnswers = () => {
    // Function to be implemented later
    alert("Submitting answers...");
    console.log("Submitting answers:", answers);
  };

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
                  
                  {/* Answer Section */}
                  <div className="mt-2">
                    {!showTextArea[q._id] && !answers[q._id] && (
                      <button
                        onClick={() => handleAnswerClick(q._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Answer
                      </button>
                    )}

                    {showTextArea[q._id] && (
                      <div className="mt-2">
                        <textarea
                          className="w-full p-2 border rounded"
                          rows="4"
                          placeholder="Type your answer here..."
                          value={answers[q._id] || ""}
                          onChange={(e) => setAnswers(prev => ({
                            ...prev,
                            [q._id]: e.target.value
                          }))}
                        />
                        <button
                          onClick={() => handleAttach(q._id, answers[q._id])}
                          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Attach
                        </button>
                      </div>
                    )}

                    {answers[q._id] && !showTextArea[q._id] && (
                      <div className="mt-2">
                        <p className="text-gray-700 truncate max-w-full">
                          {answers[q._id].length > 100 
                            ? `${answers[q._id].substring(0, 100)}...` 
                            : answers[q._id]}
                        </p>
                        <button
                          onClick={() => handleEdit(q._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No questions available.</p>
          )}

          {/* Submit Button */}
          {Object.keys(answers).length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={handleSubmitAnswers}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 text-lg font-semibold"
              >
                Submit Assignment
              </button>
            </div>
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
