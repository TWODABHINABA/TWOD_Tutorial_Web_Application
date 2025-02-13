import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import api from "../../components/User-management/api";
import "./UserInfo.css";

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/me");
        setUser(response.data);
        setUpdatedUser({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          birthday: response.data.birthday.split("T")[0],
          profilePicture: response.data.profilePicture,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [navigate]);

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

    if (Object.keys(updatedUser).length === 0) {
      alert("No changes made!");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(updatedUser).forEach((key) => {
        formData.append(key, updatedUser[key]);
      });

      const response = await api.put(`/update/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(response.data);
      setIsEditing(false);
      setUpdatedUser({});
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <>
      <Navbar />
      <div className="user-info-container">
        <h2>User Information</h2>
        {user && (
          <div className="user-details">
            <div className="left">
              {updatedUser.profilePicture || user.profilePicture ? (
                <img
                  src={
                    updatedUser.profilePicture instanceof File
                      ? URL.createObjectURL(updatedUser.profilePicture)
                      : `http://localhost:6001${user.profilePicture}`
                  }
                  alt="Profile"
                  className="profile-image"
                />
                
              ) : (
                <div className="placeholder">No Image</div>
              )}
              <div className="content">
                <p>Account Settings</p>
                <p>All Courses</p>
                <p>Logout</p>
              </div>
            </div>
            <div class= "vertical"></div>
            <div className="right">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="edit-form">
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  <input type="text" name="name" value={updatedUser.name} onChange={handleInputChange} placeholder="Enter your name" />
                  <input type="email" name="email" value={updatedUser.email} onChange={handleInputChange} placeholder="Enter your email" />
                  <input type="tel" name="phone" value={updatedUser.phone} onChange={handleInputChange} placeholder="Enter your phone number" />
                  <input type="text" name="birthday" value={updatedUser.birthday} onChange={handleInputChange} placeholder="Enter the Date Of Birth (YYYY-MMM-DD)"/>

                  {isEditing && <button type="submit" className="update-btn">Update</button>}
                  <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
              ) : (
                <>
                  <p><strong>Name:</strong>  {user.name}</p>
                  <p><strong>Email:</strong>  {user.email}</p>
                  <p><strong>Phone Number:</strong>  {user.phone}</p>
                  <p><strong>Date Of Birth:</strong>  {user.birthday.split("T")[0]}</p>
                  <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="course-details">
        <h2>Course Details</h2>
      </div>
    </>
  );
};

export default UserInfo;