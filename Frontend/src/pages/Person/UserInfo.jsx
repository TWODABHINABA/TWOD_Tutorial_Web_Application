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
    console.log(user);

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

  const handleUpdate = async () => {
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

  if (error) 
    return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <Navbar />
      <div >   
        {/* //className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg" */}
        <h2 className="text-xl font-bold mb-4">User Info</h2>
        {user && (
          <div >   {/*className="flex flex-col items-center"*/}
            {isEditing ? (
              <>
                <form
                  onSubmit={handleUpdate}
                  className="flex flex-col items-center"
                >
                  {updatedUser.profilePicture && (
                    <div className="image"><img 
                      src={
                        updatedUser.profilePicture instanceof File
                          ? URL.createObjectURL(updatedUser.profilePicture)
                          : `http://localhost:6001${updatedUser.profilePicture}`
                      }
                      alt="Profile"
                      width="150"
                      className="rounded-full shadow-md"
                    /></div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2 border p-2 rounded-md"
                  />
                  <input
                    type="text"
                    name="name"
                    value={updatedUser.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="border p-2 mt-2 w-full"
                  />
                  <input
                    type="email"
                    name="email"
                    value={updatedUser.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="border p-2 mt-2 w-full"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={updatedUser.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="border p-2 mt-2 w-full"
                  />
                  <input
                    type="date"
                    name="birthday"
                    value={updatedUser.birthday}
                    onChange={handleInputChange}
                    className="border p-2 mt-2 w-full"
                  />

                  {isEditing && (
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 mt-3 rounded-md"
                    >
                      Update
                    </button>
                  )}
                  <button type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">Name: {user.name}</p>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Phone Number: {user.phone}</p>
                <p className="text-gray-600">
                  Date Of Birth: {user.birthday.split("T")[0]}
                </p>
                {user.profilePicture && (
                  <img
                    src={`http://localhost:6001${user.profilePicture}`}
                    alt="Profile"
                    width="150"
                  />
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white p-2 rounded-lg w-full mt-4"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UserInfo;
