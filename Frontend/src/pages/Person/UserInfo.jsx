import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import api from "../../components/User-management/api";
import Footer from "../../components/footer/Footer";
import authLogout from "../../components/useLogout/UseLogout";
import { ClipLoader } from "react-spinners";
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

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   console.log("Token in localStorage:", token);
  //   if (!token) {
  //     navigate("/");
  //     return;
  //   }

  //   const fetchUser = async () => {
  //     try {
  //       const response = await api.get("/me");
  //       setUser(response.data);
  //       console.log("User data:", response.data);
  //       setUpdatedUser({
  //         name: response.data.name,
  //         email: response.data.email,
  //         phone: response.data.phone || "",
  //         birthday: response.data.birthday
  //           ? response.data.birthday.split("T")[0]
  //           : "",
  //         profilePicture: response.data.profilePicture,
  //       });
  //     } catch (err) {
  //       setError(`Error fetching user: ${err.message}`);
  //     }
  //   };

  //   fetchUser();
  // }, [navigate]);

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
          headers: { Authorization: `Bearer ${token}` }, // ✅ Attach token
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

        // If unauthorized, clear token and redirect
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };

    fetchUser();
  }, []); // ✅ No need for `navigate` in dependencies

  const handleInputChange = (e) => {
    setUpdatedUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setIsEditing(true);
  };

  const handleFileChange = (e) => {
    setUpdatedUser((prev) => ({
      ...prev,
      profilePicture: e.target.files[0],
    }));
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!Object.keys(updatedUser).length) {
      alert("No changes made!");
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(updatedUser).forEach((key) => {
        if (updatedUser[key]) {
          if (key === "subjects" && Array.isArray(updatedUser[key])) {
            formData.append(key, updatedUser[key].join(",")); // ✅ Convert array to string
          } else {
            formData.append(key, updatedUser[key]);
          }
        }
      });

      const response = await api.put(`/update/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(response.data); // ✅ Update user state with new data
      setIsEditing(false);
      setUpdatedUser({}); // ✅ Reset only after successful update

      alert("Profile updated successfully!");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Update failed. Please try again.");
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={80} color="#FFA500" />
      </div>
    );

  if (error) return <p className="error-message">Error: {error}</p>;
  return (
    <>
      <Navbar />

      <div className="bg-[#FEF9F4] min-h-screen pt-24 pb-16">
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
                {user.role==="tutor"?(<p
                  className="cursor-pointer hover:text-orange-600"
                  onClick={() => navigate("/tutor-dashboard")}
                >
                  Tutor Dashboard
                </p>):(<p></p>)}
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

                  {/* Additional fields for Tutors */}
                  {user.role === "tutor" && (
                    <>
                      {/* Description Field */}
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
