import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import SidebarMobile from "./SidebarMobile";
import api from "../../components/User-management/api";
import { useNavigate } from "react-router-dom";
const Assignment = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");

        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="flex bg-white">
      <div className="absolute md:static top-0 left-0 z-50">
        <div className="max-md:hidden">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <SidebarMobile />
        </div>
      </div>


      <div className="w-full z-0 relative">

        <Navbar title="Controls" user={user} />
        <div className="p-4 flex flex-col sm:flex-row gap-4">

          <button
            onClick={() => navigate("/tutor-send-assignment")}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors w-full sm:w-auto"
          >
            Send Assignment
          </button>


          <button
            onClick={() => navigate("/tutor-add-availability")}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors w-full sm:w-auto"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
export default Assignment;
