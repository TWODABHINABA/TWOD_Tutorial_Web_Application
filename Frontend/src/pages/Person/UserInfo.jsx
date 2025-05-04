import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import api from "../../components/User-management/api";
import Footer from "../../components/footer/Footer";
import authLogout from "../../components/useLogout/UseLogout";
import { ClipLoader } from "react-spinners";
import Toast from "../login_signup/Toast";
// import "./UserInfo.css";

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const navigate = useNavigate();
  const { handleLogout } = authLogout();
  const [loading, setLoading] = useState(true);
  const [allSubjects, setAllSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get("/subjects"); // Fetch subjects from backend
        setAllSubjects(response.data); // Store in state
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleSelect = (e) => {
    const selectedSubject = e.target.value;
    if (selectedSubject && !subjects.includes(selectedSubject)) {
      setSubjects([...subjects, selectedSubject]);
    }
  };

  const removeSubject = (subject) => {
    setSubjects(subjects.filter((item) => item !== subject));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", token);

    if (!token) {
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        console.log("User data:", response.data);

        setUpdatedUser({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || "",
          birthday: response.data.birthday
            ? response.data.birthday.split("T")[0]
            : "",
          profilePicture: response.data.profilePicture,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(`Error fetching user: ${err.message}`);

        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };

    fetchUser();
  }, []);

  // const handleInputChange = (e) => {
  //   setUpdatedUser((prev) => ({
  //     ...prev,
  //     [e.target.name]: e.target.value,
  //   }));
  //   setIsEditing(true);
  // };
  const handleValidation = (name, value) => {
    let errorMsg = "";
    let isValid = true;
  
    if (name === "email") {
      isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(value);
      if (!isValid) errorMsg = "Invalid email format. Use '@something.com'";
    }
  
    if (name === "phone") {
      isValid = /^\d{10}$/.test(value);
      if (!isValid) errorMsg = "Phone number must be 10 digits.";
    }
  
    if (name === "birthday") {
      isValid = /^\d{4}-\d{2}-\d{2}$/.test(value);
      if (!isValid) errorMsg = "Birthday must be in 'YYYY-MM-DD' format.";
    }
  
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    setValid((prev) => ({ ...prev, [name]: isValid }));
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    handleValidation(name, value);
  };

  const handleFileChange = (e) => {
    setUpdatedUser((prev) => ({
      ...prev,
      profilePicture: e.target.files[0],
    }));
    setIsEditing(true);
  };

  // const handleUpdate = async (e) => {
  //   e.preventDefault();

  //   if (!Object.keys(updatedUser).length) {
  //     alert("No changes made!");
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();

  //     Object.keys(updatedUser).forEach((key) => {
  //       if (updatedUser[key]) {
  //         if (key === "subjects" && Array.isArray(updatedUser[key])) {
  //           formData.append(key, updatedUser[key].join(","));
  //         } else {
  //           formData.append(key, updatedUser[key]);
  //         }
  //       }
  //     });

  //     const response = await api.put(`/update/${user._id}`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     setUser(response.data);
  //     setIsEditing(false);
  //     setUpdatedUser({});

  //     setToast({
  //       show: true,
  //       message: "Profile updated successfully!",
  //       type: "success",
  //     });
  //     setTimeout(()=>{
  //       setToast(false)
  //       navigate(0);
  //     },800)
  //   } catch (err) {
  //     if (err.response) {

  //       setToast({
  //         show: true,
  //         message: err.response?.data?.message || "Update failed. Please try again.",
  //         type: "error",
  //       });
  //     } else {
  //       setToast({
  //         show: true,
  //         message: "Network error. Please try again.",
  //         type: "error",
  //       });
  //     }
  //   }
  // };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!Object.keys(updatedUser).length) {
      alert("No changes made!");
      return;
    }

    let formHasError = false;

    const tempErrors = {};
    const tempValid = {};

    const validateField = (field, value) => {
      switch (field) {
        case "email":
          tempValid[field] = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(
            value
          );
          tempErrors[field] = tempValid[field]
            ? ""
            : "Invalid email format. Use '@something.com'.";
          break;

        case "phone":
          tempValid[field] = /^\d{10}$/.test(value);
          tempErrors[field] = tempValid[field]
            ? ""
            : "Phone number must be 10 digits.";
          break;

        case "birthday":
          tempValid[field] = /^\d{4}-\d{2}-\d{2}$/.test(value);
          tempErrors[field] = tempValid[field]
            ? ""
            : "Birthday must be in 'YYYY-MM-DD' format.";
          break;

        case "name":
          tempValid[field] = value.trim().length >= 2;
          tempErrors[field] = tempValid[field]
            ? ""
            : "Name must be at least 2 characters.";
          break;

        default:
          tempValid[field] = true;
          tempErrors[field] = "";
      }

      if (!tempValid[field]) formHasError = true;
    };

    // Validate only the updated fields
    Object.entries(updatedUser).forEach(([field, value]) => {
      validateField(field, value);
    });

    setErrors(tempErrors);
    setValid(tempValid);

    if (formHasError) {
      const firstError = Object.values(tempErrors).find((msg) => msg);
      setToast({
        show: true,
        message: firstError || "Please correct the highlighted errors.",
        type: "error",
      });
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(updatedUser).forEach((key) => {
        if (updatedUser[key]) {
          if (key === "subjects" && Array.isArray(updatedUser[key])) {
            formData.append(key, updatedUser[key].join(","));
          } else {
            formData.append(key, updatedUser[key]);
          }
        }
      });

      const response = await api.put(`/update/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(response.data);
      setIsEditing(false);
      setUpdatedUser({});

      setToast({
        show: true,
        message: "Profile updated successfully!",
        type: "success",
      });

      setTimeout(() => {
        setToast(false);
        navigate(0);
      }, 800);
    } catch (err) {
      if (err.response) {
        setToast({
          show: true,
          message:
            err.response?.data?.message || "Update failed. Please try again.",
          type: "error",
        });
      } else {
        setToast({
          show: true,
          message: "Network error. Please try again.",
          type: "error",
        });
      }
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
        <ClipLoader size={80} color="#FFA500" />
      </div>
    );

  if (error) return <p className="error-message">Error: {error}</p>;
  return (
    <>
      <Navbar />
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false })}
        />
      )}

      <div className="bg-[#FEF9F4] min-h-screen pt-24 pb-16 max-md:pt-16 max-md:pb-12">
        {user && (
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 max-md:grid-cols-1 max-md:gap-4">
            <div className="max-md:p-4 bg-orange-50 border border-orange-200 rounded-3xl shadow-lg p-6 flex flex-col items-center text-center gap-6">
              {updatedUser.profilePicture || user.profilePicture ? (
                <img
                  src={
                    updatedUser.profilePicture instanceof File
                      ? URL.createObjectURL(updatedUser.profilePicture)
                      : `https://twod-tutorial-web-application-3brq.onrender.com${user.profilePicture}` ||
                        `http://localhost:6001${user.profilePicture}`
                  }
                  alt="Profile"
                  className="w-36 h-36 max-md:w-28 max-md:h-28 rounded-full object-cover border-4 border-orange-300"
                />
              ) : (
                <div className="w-36 h-36 max-md:w-28 max-md:h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  No Image
                </div>
              )}

              <h2 className="text-2xl font-semibold text-gray-800">
                {user.name}
              </h2>

              <div className="space-y-3 w-full">
              {user.role === "tutor" ? (
  <p
    className="cursor-pointer hover:text-orange-600"
    onClick={() => navigate("/tutor-dashboard")}
  >
    Tutor Dashboard
  </p>
) : user.role === "admin" ? (
  <p
    className="cursor-pointer hover:text-orange-600"
    onClick={() => navigate("/admin-dashboard")}
  >
    Admin Dashboard
  </p>
) : (
  <p></p>
)}

                <p className="cursor-pointer hover:text-orange-600">
                  Account Settings
                </p>
                <p
                  className="cursor-pointer hover:text-orange-600"
                  onClick={() => navigate("/category/:categoryName")}
                >
                  All Courses
                </p>
                <p
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>

            <div className="md:col-span-2 bg-white border border-orange-200 rounded-3xl shadow-lg p-8 max-md:p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                👤 Your Profile
              </h2>
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="block mb-2 font-medium">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  {/* {["name", "email", "phone", "birthday"].map((field, idx) => (
                    <div key={idx}>
                      <label className="block mb-2 font-medium capitalize">
                        {field === "birthday" ? "Date of Birth" : field}
                      </label>
                      <input
                        type={
                          field === "email"
                            ? "email"
                            : field === "phone"
                            ? "tel"
                            : field === "birthday"
                            ? "text"
                            : "text"
                        }
                        name={field}
                        value={updatedUser[field] ?? user[field] ?? ""}
                        onChange={handleInputChange}
                        placeholder={`Enter your ${field}`}
                        className="w-full border p-3 rounded-lg"
                      />
                    </div>
                  ))} */}

                  {["name", "email", "phone", "birthday"].map((field, idx) => (
                    <div key={idx}>
                      <label className="block mb-2 font-medium capitalize">
                        {field === "birthday" ? "Date of Birth" : field}
                      </label>
                      <input
                        type={
                          field === "email"
                            ? "email"
                            : field === "phone"
                            ? "tel"
                            : field === "birthday"
                            ? "text"
                            : "text"
                        }
                        name={field}
                        value={updatedUser[field] ?? user[field] ?? ""}
                        onChange={handleInputChange}
                        placeholder={`Enter your ${field}`}
                        className={`w-full border p-3 rounded-lg ${
                          touched[field] && errors[field]
                            ? "border-red-500"
                            : touched[field] && valid[field]
                            ? "border-green-500"
                            : ""
                        }`}
                      />
                      {touched[field] && errors[field] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field]}
                        </p>
                      )}
                    </div>
                  ))}

     
                  {user.role === "tutor" && (
                    <>
                      <div>
                        <label className="block mb-2 font-medium">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={
                            updatedUser.description ?? user.description ?? ""
                          }
                          onChange={handleInputChange}
                          placeholder="Enter your description"
                          className="w-full border p-3 rounded-lg"
                        />
                      </div>

                      {/* Subjects Dropdown */}
                      <div className="mb-4">
                        <label className="block font-semibold">
                          Select Subjects
                        </label>

                        {/* Display selected subjects with remove option */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {updatedUser.subjects?.map((subject, index) => (
                            <div
                              key={index}
                              className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
                            >
                              {subject}
                              <button
                                onClick={() =>
                                  setUpdatedUser({
                                    ...updatedUser,
                                    subjects: updatedUser.subjects.filter(
                                      (s) => s !== subject
                                    ),
                                  })
                                }
                                className="ml-2 text-white font-bold px-2"
                              >
                                ❌
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Dropdown to select subjects */}
                        <select
                          className="w-full p-2 border rounded"
                          onChange={(e) => {
                            if (e.target.value) {
                              setUpdatedUser({
                                ...updatedUser,
                                subjects: [
                                  ...(updatedUser.subjects || []),
                                  e.target.value,
                                ],
                              });
                            }
                          }}
                          value=""
                        >
                          <option value="" disabled>
                            Select a subject
                          </option>
                          {allSubjects
                            .filter(
                              (subject) =>
                                !updatedUser.subjects?.includes(subject)
                            ) // Hide selected subjects
                            .map((subject, index) => (
                              <option key={index} value={subject}>
                                {subject}
                              </option>
                            ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: "Name", value: user.name },
                    { label: "Email", value: user.email },
                    { label: "Phone Number", value: user.phone },
                    {
                      label: "Date of Birth",
                      value: user.birthday
                        ? user.birthday.split("T")[0]
                        : "Not provided",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between border-b py-2"
                    >
                      <span className="font-medium">{item.label}:</span>
                      <span>{item.value}</span>
                    </div>
                  ))}

                  {/* Display Tutor-Specific Info */}
                  {user.role === "tutor" && (
                    <>
                      <div className="flex justify-between border-b py-2">
                        <span className="font-medium">Description:</span>
                        <span>{user.description || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between border-b py-2">
                        <span className="font-medium">Subjects:</span>
                        <span>{user.subjects || "Not provided"}</span>
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 bg-orange-500 text-white py-3 w-full rounded-lg hover:bg-orange-600"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default UserInfo;

// const handleUpdate = async (e) => {
//   e.preventDefault();

//   if (Object.keys(updatedUser).length === 0) {
//     alert("No changes made!");
//     return;
//   }

//   try {
//     const formData = new FormData();
//     Object.keys(updatedUser).forEach((key) => {
//       formData.append(key, updatedUser[key]);
//     });

//     const response = await api.put(`/update/${user._id}`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     setUser(response.data);
//     setIsEditing(false);
//     setUpdatedUser({});
//   } catch (err) {
//     setError(err.message);
//   }
// };
{
  /* <div className="bg-[#FEF9F4] min-h-screen pt-24 pb-16">
        {user && (
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-orange-50 border border-orange-200 rounded-3xl shadow-lg p-6 flex flex-col items-center text-center gap-6">
              {updatedUser.profilePicture || user.profilePicture ? (
                <img
                  src={
                    updatedUser.profilePicture instanceof File
                      ? URL.createObjectURL(updatedUser.profilePicture)
                      : `https://twod-tutorial-web-application-3brq.onrender.com${user.profilePicture}` ||
                        `http://localhost:6001${user.profilePicture}`

                    // :`https://twod-tutorial-web-application-3brq.onrender.com${user.profilePicture}`
                  }
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-orange-300"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  No Image
                </div>
              )}

              <h2 className="text-2xl font-semibold text-gray-800">
                {user.name}
              </h2>

              <div className="space-y-3 w-full">
                <p className="cursor-pointer hover:text-orange-600">
                  Account Settings
                </p>
                <p
                  className="cursor-pointer hover:text-orange-600"
                  onClick={() => navigate("/category/:categoryName")}
                >
                  All Courses
                </p>
                <p
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>

            <div className="md:col-span-2 bg-white border border-orange-200 rounded-3xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                👤 Your Profile
              </h2>
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="block mb-2 font-medium">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  {["name", "email", "phone", "birthday"].map((field, idx) => (
                    <div key={idx}>
                      <label className="block mb-2 font-medium capitalize">
                        {field === "birthday" ? "Date of Birth" : field}
                      </label>
                      <input
                        type={
                          field === "email"
                            ? "email"
                            : field === "phone"
                            ? "tel"
                            : "text"
                        }
                        name={field}
                        value={updatedUser[field]}
                        onChange={handleInputChange}
                        placeholder={`Enter your ${field}`}
                        className="w-full border p-3 rounded-lg"
                      />
                    </div>
                  ))}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: "Name", value: user.name },
                    { label: "Email", value: user.email },
                    { label: "Phone Number", value: user.phone },
                    {
                      label: "Date of Birth",
                      value: user.birthday
                        ? user.birthday.split("T")[0]
                        : "Not provided",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between border-b py-2"
                    >
                      <span className="font-medium">{item.label}:</span>
                      <span>{item.value}</span>
                    </div>
                  ))}

                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 bg-orange-500 text-white py-3 w-full rounded-lg hover:bg-orange-600"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div> */
}
