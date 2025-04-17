// src/pages/tutors/Requests.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import SidebarMobile from "./SidebarMobile";
import api from "../../components/User-management/api";

const Requests = () => {
  const [notifications, setNotifications] = useState([]);
  const tutorToken = localStorage.getItem("token");
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
  console.log(user);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // console.log("Tutor token:", tutorToken);
        const res = await api.get("/paylater/tutor-request", {
          headers: {
            Authorization: `Bearer ${tutorToken}`,
          },
        });

        // console.log("✅ Fetched Requests:", res.data);
        setNotifications(res.data.data);
        // console.log(res.data.data[0].tutorId) // assuming response data structure { data: [...] }
      } catch (err) {
        console.error("❌ Error fetching tutor requests", err);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);

    // Cleanup
    return () => clearInterval(interval);
  }, [tutorToken]);

  const handleAction = async (id, action) => {
    try {
      const res = await api.put(`/paylater/${id}/status`, { status: action });
      console.log(`✅ Status updated for ID ${id} to ${action}:`, res.data);

      setNotifications((prev) =>
        prev.map((noti) => (noti._id === id ? { ...noti, status: action } : noti))
      );
    } catch (error) {
      console.error(`❌ Failed to update status for ID ${id}:`, error);
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      {/* Sidebar */}
      <div className="absolute md:static top-0 left-0 z-50">
        <div className="max-md:hidden">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <SidebarMobile />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full z-0 relative">
        <Navbar title="Requests" user = {user}/>
        <div className="p-4 bg-[#FAF3E0]">
          <h2 className="text-xl font-bold text-orange-500 mb-4">Course Booking Requests</h2>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-gray-600">No requests found.</p>
            ) : (
              notifications.map((noti) => (
                <div
                  key={noti._id}
                  className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">{noti.user?.name}</span> has requested to join{" "}
                      <span className="font-semibold">{noti.courseId?.courseType}</span> of {" "}
                      <span className="font-semibold">{noti.courseId?.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Requested on {noti.selectedDate} at {noti.selectedTime} | Duration: {noti.duration}
                    </p>
                  </div>

                  <div className="mt-2 sm:mt-0 flex gap-2">
                    {noti.status === "pending for tutor acceptance" ? (
                      <>
                        <button
                          onClick={() => handleAction(noti._id, "accepted")}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(noti._id, "rejected")}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 text-sm rounded ${
                          noti.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {noti.status.charAt(0).toUpperCase() + noti.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;
