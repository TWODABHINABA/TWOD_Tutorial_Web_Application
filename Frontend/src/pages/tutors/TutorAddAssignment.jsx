import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import SidebarMobile from "./SidebarMobile";
import Navbar from "./Navbar";
import api from "../../components/User-management/api";
import Toast from "../login_signup/Toast";
import { useNavigate } from "react-router-dom";

const TutorAddAssignment = () => {
  const [subjectCounts, setSubjectCounts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [existingAssignment, setExistingAssignment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);
        setSubjectCounts(res.data.subjects);
      } catch (err) {
        console.error("Error fetching user:", err);
        setToast({
          show: true,
          message: "Failed to fetch user data.",
          type: "error",
        });
      }
    };
    fetchUser();
  }, []);

  const [formData, setFormData] = useState({
    courseName: "",
    courseType: "",
    description: "",
  });

  const fetchExistingAssignment = async () => {
    if (!formData.courseName || !formData.courseType) return;

    try {
      const res = await api.get("/get-assignment", {
        params: {
          courseName: formData.courseName,
          courseType: formData.courseType,
        },
      });

      if (res.data) {
        setExistingAssignment(res.data);
        setFormData({
          ...formData,
          description: res.data.description || "",
        });
        setQuestions(res.data.questions || [{ text: "", number: "" }]);
        setIsEditing(true);
        setToast({
          show: true,
          message: "Assignment loaded. You can now edit it.",
          type: "success",
        });
      } else {
        setExistingAssignment(null);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error fetching assignment:", err);
      setToast({
        show: true,
        message: "No existing assignment found.",
        type: "error",
      });
      setExistingAssignment(null);
      setIsEditing(false);
    }
  };

  const handleChangeGrade = async (e) => {
    const { name, value } = e.target;

    const updatedForm = { ...formData, [name]: value };

    setFormData(updatedForm);
    setQuestions([{ text: "", number: "" }]);

    if (name === "courseName") {
      try {
        const res = await api.get(`/grades-by-subject/${value}`);
        setAvailableGrades(res.data.grades);
      } catch (err) {
        console.error("Error fetching grades:", err);
        setAvailableGrades([]);
        setToast({
          show: true,
          message: "Failed to fetch grades for the selected subject.",
          type: "error",
        });
      }
    }

    if (
      (name === "courseType" && updatedForm.courseName) ||
      (name === "courseName" && updatedForm.courseType)
    ) {
      try {
        const res = await api.get("/get-assignment", {
          params: {
            courseName: updatedForm.courseName,
            courseType: updatedForm.courseType,
          },
        });

        if (res.data) {
          setExistingAssignment(res.data);
          setFormData((prev) => ({
            ...prev,
            description: res.data.description || "",
          }));
          setQuestions(res.data.questions || [{ text: "", number: "" }]);
          setIsEditing(true);
          setToast({
            show: true,
            message: "Assignment loaded. You can now edit it.",
            type: "success",
          });
          setTimeout(() => {
            setToast(false);
          }, 1500);
        } else {
          setExistingAssignment(null);
          setIsEditing(false);
        }
      } catch (err) {
        console.error("Error fetching assignment:", err);
        setToast({
          show: true,
          message: "No existing assignment found.",
          type: "info",
        });
        setTimeout(() => {
          setToast(false);
        }, 1500);
        setExistingAssignment(null);
        setIsEditing(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: "", number: "" }]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put(
        `/update-assignment/${existingAssignment._id}`,
        {
          ...formData,
          questions,
        }
      );

      if (res.data.success) {
        setToast({
          show: true,
          message: "Assignment updated successfully.",
          type: "success",
        });
        setTimeout(() => {
          setToast(false);
          navigate(0);
        }, 1500);
        setFormData({
          courseName: "",
          courseType: "",
          description: "",
        });
        setQuestions([{ text: "", number: "" }]);
        setIsEditing(false);
      }
    } catch (err) {
      setToast({
        show: true,
        message: "Failed to update assignment.",
        type: "error",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post(
        "/upload-assignment",
        {
          ...formData,
          questions,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setSuccess("Assignment uploaded successfully.");
        setToast({
          show: true,
          message: "Assignment uploaded successfully.",
          type: "success",
        });
        setTimeout(() => {
          setToast(false);
          navigate(0);
        }, 1500);
        setFormData({
          courseName: "",
          courseType: "",
          description: "",
        });
        setQuestions([{ text: "", number: "" }]);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Conflicts with the time and Date";

      setToast({
        show: true,
        message,
        type: "error",
      });

      if (
        err.response &&
        err.response.data &&
        err.response.data.message ===
          "Assignment for this subject and grade already exists."
      ) {
        setError(
          "You've already uploaded an assignment for this subject and grade."
        );

        setToast({
          show: true,
          message:
            "You've already uploaded an assignment for this subject and grade.",
          type: "error",
        });
      } else {
        setToast({
          show: true,
          message: "Something went wrong while uploading.",
          type: "error",
        });
      }
    }
  };

  const handleReset = () => {
    setFormData({
      courseName: "",
      courseType: "",
      description: "",
    });

    setQuestions([{ text: "", number: "" }]);

    setIsEditing(false);
  };

  return (
    <>
      <div className="flex bg-gray-50 min-h-screen">
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false })}
          />
        )}
        <div className="absolute md:static top-0 left-0 z-50">
          <div className="max-md:hidden">
            <Sidebar />
          </div>
          <div className="md:hidden">
            <SidebarMobile />
          </div>
        </div>

        <div className="w-full z-0 relative">
          <Navbar title="Dashboard" user={user} />

          {/* Existing Assignment Preview */}
          {existingAssignment && !isEditing && (
            <div className="absolute top-4 left-full ml-6 w-96 p-4 border shadow-md bg-white rounded-lg">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                Existing Assignment
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Subject:</strong> {existingAssignment.courseName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Grade:</strong> {existingAssignment.courseType}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Description:</strong> {existingAssignment.description}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Total Questions:</strong>{" "}
                {existingAssignment.questions.length}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Total Marks:</strong>{" "}
                {existingAssignment.questions.reduce(
                  (total, q) => total + (parseInt(q.number) || 0),
                  0
                )}
              </p>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setFormData({
                    courseName: existingAssignment.courseName,
                    courseType: existingAssignment.courseType,
                    description: existingAssignment.description || "",
                  });
                  setQuestions(existingAssignment.questions || []);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              >
                Edit This Assignment
              </button>
            </div>
          )}

          <div className="max-w-3xl mx-auto mt-10 p-4 sm:p-6 bg-indigo-50 shadow-xl rounded-xl border border-indigo-200 relative">
            {questions.length > 0 && (
              <div className="absolute top-4 right-6 text-right bg-white p-2 px-4 rounded-lg shadow-md border border-indigo-200">
                <p className="text-indigo-700 font-semibold">
                  Total Questions: {questions.length}
                </p>
                <p className="text-indigo-700 font-semibold">
                  Total Marks:{" "}
                  {questions.reduce(
                    (total, q) => total + (parseInt(q.number) || 0),
                    0
                  )}
                </p>
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6 text-center">
              {isEditing ? "Edit Assignment" : "Upload Assignment"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                isEditing ? handleUpdate() : handleSubmit(e);
              }}
              className="space-y-4"
            >
              <select
                name="courseName"
                value={formData.courseName}
                onChange={handleChangeGrade}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                required
                disabled={isEditing}
              >
                <option value="">Select Subject</option>
                {subjectCounts.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>

              <select
                name="courseType"
                value={formData.courseType}
                onChange={handleChangeGrade}
                className="w-full p-3 mt-4 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                required
                disabled={isEditing || availableGrades.length === 0}
              >
                <option value="">Select Grade</option>
                {availableGrades.map((grade, index) => (
                  <option key={index} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>

              <textarea
                name="description"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <div>
                <h3 className="text-lg font-semibold mb-2 text-indigo-600">
                  Questions
                </h3>
                {questions.map((q, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-4 mb-4"
                  >
                    <input
                      type="text"
                      placeholder={`Question ${index + 1}`}
                      value={q.text}
                      onChange={(e) =>
                        handleQuestionChange(index, "text", e.target.value)
                      }
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Marks"
                      value={q.number}
                      onChange={(e) =>
                        handleQuestionChange(index, "number", e.target.value)
                      }
                      className="w-28 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      ✖
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addQuestion}
                  className="text-sm text-blue-600 font-semibold hover:underline"
                >
                  + Add Question
                </button>
              </div>

              <button
                type="submit"
                disabled={!isEditing && !!existingAssignment}
                className={`${
                  isEditing
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : existingAssignment
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white px-6 py-3 rounded-lg mt-6 block mx-auto font-semibold transition duration-200`}
              >
                {isEditing ? "Update Assignment" : "Upload Assignment"}
              </button>
              {isEditing === true && (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg mt-6 block mx-auto font-semibold transition duration-200"
                  onClick={handleReset}
                >
                  Add New Assignment
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorAddAssignment;
