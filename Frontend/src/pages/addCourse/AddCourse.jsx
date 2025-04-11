import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/User-management/api";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
const AddCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseType: "",
    name: "",
    overview: "",
    description: "",
    price: "",
    discountPrice: "",
    duration: "",
    level: "",
    curriculum: [],
  });
  const [courseTypeImage, setCourseTypeImage] = useState(null);
  const [nameImage, setNameImage] = useState(null);

  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  console.log(role);
  console.log(token);

  useEffect(() => {
    if (role !== "tutor" && role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurriculumChange = (index, field, value) => {
    const updatedCurriculum = [...formData.curriculum];
    updatedCurriculum[index][field] = value;
    setFormData({ ...formData, curriculum: updatedCurriculum });
  };

  const handleLessonChange = (sectionIndex, lessonIndex, field, value) => {
    const updatedCurriculum = [...formData.curriculum];
    updatedCurriculum[sectionIndex].lessons[lessonIndex][field] = value;
    setFormData({ ...formData, curriculum: updatedCurriculum });
  };
  const handleFileChange = (e, type) => {
    if (type === "courseTypeImage") {
      setCourseTypeImage(e.target.files[0]);
    } else if (type === "nameImage") {
      setNameImage(e.target.files[0]);
    }
  };

  
  const addCurriculumSection = () => {
    setFormData({
      ...formData,
      curriculum: [...formData.curriculum, { sectionTitle: "", lessons: [] }],
    });
  };
  const removeCurriculumSection = (index) => {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index),
    }));
  };

  const addLesson = (sectionIndex) => {
    const updatedCurriculum = [...formData.curriculum];
    updatedCurriculum[sectionIndex].lessons.push({ title: "", duration: "" });
    setFormData({ ...formData, curriculum: updatedCurriculum });
  };
  
  
  const removeLesson = (sectionIndex, lessonIndex) => {
    setFormData((prev) => {
      const updatedCurriculum = prev.curriculum.map((section, i) => {
        if (i === sectionIndex) {
          return {
            ...section,
            lessons: section.lessons.filter((_, j) => j !== lessonIndex),
          };
        }
        return section;
      });
  
      return { ...prev, curriculum: updatedCurriculum };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const formDataToSend = new FormData(); 
  
   
    Object.keys(formData).forEach((key) => {
      if (key === "curriculum") {
        formDataToSend.append(key, JSON.stringify(formData[key])); 
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
  
  
    if (courseTypeImage) {
      formDataToSend.append("courseTypeImage", courseTypeImage);
    }
    if (nameImage) {
      formDataToSend.append("nameImage", nameImage);
    }
  
    try {
      const response = await api.post("/add", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", 
        },
      });
  
      console.log(response);
      alert("Course added successfully!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add course.");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border">
      
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Add New Course
      </h2>

      {error && (
        <p className="text-red-600 font-semibold text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="courseType"
          placeholder="Enter Subject"
          value={formData.courseType}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <input
          type="file"
          placeholder="Enter the Subject Image"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "courseTypeImage")}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="text"
          name="name"
          placeholder="Grade"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <input
          type="file"
          accept="image/*"
          placeholder="Enter the Grade Image"
          onChange={(e) => handleFileChange(e, "nameImage")}
          className="w-full p-3 border rounded-lg"
        />

        <textarea
          name="overview"
          placeholder="Overview"
          value={formData.overview}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <input
          type="text"
          name="discountPrice"
          placeholder="Discount Price"
          value={formData.discountPrice}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g., 15 hours)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="text"
          name="level"
          placeholder="Level (Beginner, Intermediate, Advanced)"
          value={formData.level}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Curriculum Sections */}
        <h3 className="text-xl font-semibold mt-6 text-gray-800">Curriculum</h3>
        {formData.curriculum.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-6 p-4 border rounded-lg bg-gray-100 shadow-sm relative"
          >
            <input
              type="text"
              placeholder="Section Title"
              value={section.sectionTitle}
              onChange={(e) =>
                handleCurriculumChange(
                  sectionIndex,
                  "sectionTitle",
                  e.target.value
                )
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mb-3"
            />


            {section.lessons.map((lesson, lessonIndex) => (
              <div
                key={lessonIndex}
                className="p-3 border rounded-lg bg-white shadow-md mt-3 relative"
              >
                <input
                  type="text"
                  placeholder="Lesson Title"
                  value={lesson.title}
                  onChange={(e) =>
                    handleLessonChange(
                      sectionIndex,
                      lessonIndex,
                      "title",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mb-2"
                />
                <input
                  type="text"
                  placeholder="Lesson Duration (e.g., 10 mins)"
                  value={lesson.duration}
                  onChange={(e) =>
                    handleLessonChange(
                      sectionIndex,
                      lessonIndex,
                      "duration",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />


                <button
                  type="button"
                  onClick={() => removeLesson(sectionIndex, lessonIndex)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mt-3 transition duration-200"
                >
                  🗑 Delete Lesson
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addLesson(sectionIndex)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg mt-3 transition duration-200"
            >
              + Add Lesson
            </button>

 
            <button
              type="button"
              onClick={() => removeCurriculumSection(sectionIndex)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg mt-3 ml-3 transition duration-200"
            >
              🗑 Delete Section
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addCurriculumSection}
          className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg mt-4 block mx-auto transition duration-200"
        >
          + Add Section
        </button>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg mt-6 block mx-auto font-semibold transition duration-200"
        >
          Add Course
        </button>
      </form>
    </div>
    <Footer/>
    </>
  );
};

export default AddCourse;
