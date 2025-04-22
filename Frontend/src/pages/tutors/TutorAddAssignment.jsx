import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import SidebarMobile from "./SidebarMobile";
import Navbar from "./Navbar";
import axios from "axios";
import api from "../../components/User-management/api";

const TutorAddAssignment = () => {
  const [subjectCounts, setSubjectCounts] = useState([]);
  //   const [questions, setQuestions] = useState([{ text: "", number: "" }]);
  const [questions, setQuestions] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user,setUser]=useState(null)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);
        setSubjectCounts(res.data.subjects);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);
  const [formData, setFormData] = useState({
    courseName: "",
    courseType: "",
    description: "",
  });

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
        setFormData({
          courseName: "",
          courseType: "",
          description: "",
        });
        setQuestions([{ text: "", number: "" }]);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while uploading.");
    }
  };

  return (
    <>
      <div className="flex bg-gray-50 min-h-screen">
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
              Upload Assignment
            </h2>

            {error && (
              <p className="text-red-600 font-semibold text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-600 font-semibold text-center">
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              >
                <option value="">Select Subject</option>
                {subjectCounts.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="courseType"
                placeholder="Course Type (e.g. Grade 10)"
                value={formData.courseType}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
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
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg mt-6 block mx-auto font-semibold transition duration-200"
              >
                Upload Assignment
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorAddAssignment;
