import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import api from "../../components/User-management/api";
const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
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
      } catch (err) {
        setError(err.message);
      }
    };
    console.log(user);

    fetchUser();
  }, [navigate]);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">User Info</h2>
        {user && (
          <div className="flex flex-col items-center">
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
          </div>
        )}
      </div>
    </>
  );
};

export default UserInfo;
