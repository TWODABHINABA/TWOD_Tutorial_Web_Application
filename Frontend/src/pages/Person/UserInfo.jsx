import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
const UserInfo = () => {
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // const userId = localStorage.getItem("_id"); // Store userId after login
    console.log(token);
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      // e.preventDefault();
      try {
        const response = await axios.get("http://localhost:6001/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        console.log(response.data);
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
            <p className="text-lg font-semibold">Name:  {user.name}</p>
            <p className="text-gray-600">Email:  {user.email}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default UserInfo;
