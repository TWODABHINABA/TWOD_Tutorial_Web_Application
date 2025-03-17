import React, { useEffect, useState } from "react";
import api from "../../components/User-management/api";

const SessionAdmin = () => {
  const [sessions, setSessions] = useState([]);
  const [newDuration, setNewDuration] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedSession, setEditedSession] = useState({ duration: '', price: '' });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get("/get-session");
      if (response.data.success) {
        setSessions(response.data.data.sessions);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  // Add a new session
  const handleAddSession = async () => {
    if (!newDuration || !newPrice)
      return alert("Please enter both duration and price");
    try {
      const response = await api.post("/add", {
        duration: newDuration,
        price: newPrice,
      });
      if (response.data.success) {
        fetchSessions(); // Refresh list
        setNewDuration("");
        setNewPrice("");
      }
    } catch (error) {
      console.error("Error adding session:", error);
    }
  };

  // Update session
  //   const handleUpdateSession = async (index, updatedPrice) => {
  //     try {
  //       const response = await api.put("/update", {
  //         index,
  //         price: updatedPrice,
  //       });
  //       if (response.data.success) {
  //         fetchSessions(); // Refresh list
  //       }
  //     } catch (error) {
  //       console.error("Error updating session:", error);
  //     }
  //   };

  const handleSaveEdit = async (index) => {
    try {
      const response = await api.put(
        `/update/${index}`,
        editedSession
      );
      if (response.data.success) {
        fetchSessions();
        setEditIndex(null);
      }
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditedSession({ ...sessions[index] });
  };

  // Delete session

  //   const handleDeleteSession = async (index) => {
  //     if (!window.confirm("Are you sure you want to delete this session?"))
  //       return;
  //     try {
  //       const response = await api.delete(`delete/${index}`);
  //       if (response.data.success) {
  //         fetchSessions(); // Refresh list
  //       }
  //     } catch (error) {
  //       console.error("Error deleting session:", error);
  //     }
  //   };
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Session Pricing</h1>

      {/* Add Session */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Session</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Duration (e.g., 30 minutes)"
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            className="border rounded-lg px-3 py-2 w-1/2"
          />
          <input
            type="text"
            placeholder="Price (e.g., 2200)"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="border rounded-lg px-3 py-2 w-1/2"
          />
          <button
            onClick={handleAddSession}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>
      </div>

      {/* Existing Sessions */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Sessions</h2>
        {sessions.map((session, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b py-2 gap-4"
          >
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editedSession.duration}
                  onChange={(e) =>
                    setEditedSession({ ...editedSession, duration: e.target.value })
                  }
                  className="border rounded-lg px-2 py-1 w-1/3"
                />
                <input
                  type="number"
                  value={editedSession.price}
                  onChange={(e) =>
                    setEditedSession({ ...editedSession, price: e.target.value })
                  }
                  className="border rounded-lg px-2 py-1 w-1/4 text-right"
                />
                <button
                  onClick={() => handleSaveEdit(index)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditIndex(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="font-medium w-1/3">{session.duration}</p>
                <p className="w-1/4 text-right">Rs. {session.price.toLocaleString()}</p>
                <button
                  onClick={() => handleEditClick(index)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSession(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionAdmin;
