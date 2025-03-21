import { useEffect, useState } from "react";
import api from "../../components/User-management/api";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

export default function ManageSessionPricing() {
  const [sessions, setSessions] = useState([]);
  const [newDuration, setNewDuration] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedSession, setEditedSession] = useState({
    duration: "",
    price: "",
  });

  // Fetch existing sessions
  const fetchSessions = async () => {
    try {
      const response = await api.get("/get-session");
      if (response.data.success) {
        setSessions(response.data.data.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Add session to local list
  const handleAddSession = () => {
    if (!newDuration || !newPrice)
      return alert("Please enter both duration and price");

    const updatedSessions = [
      ...sessions,
      { duration: newDuration, price: newPrice },
    ];
    setSessions(updatedSessions);
    setNewDuration("");
    setNewPrice("");
  };

  // Save all sessions to backend (replacing old list)
  const handleSaveAllSessions = async () => {
    if (sessions.length === 0)
      return alert("Please add at least one session before saving.");

    try {
      const response = await api.post("/add-session", {
        sessions,
      });
      if (response.data.success) {
        alert("Session pricing saved successfully!");
        fetchSessions();
      }
    } catch (error) {
      console.error("Error saving sessions:", error);
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditedSession({ ...sessions[index] });
  };

  // Handle save after edit
  const handleSaveEdit = (index) => {
    const updatedSessions = [...sessions];
    updatedSessions[index] = editedSession;
    setSessions(updatedSessions);
    setEditIndex(null);
  };

  // Handle delete session from local list
  const handleDeleteSession = (index) => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;
    const updatedSessions = sessions.filter((_, i) => i !== index);
    setSessions(updatedSessions);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Session Pricing</h1>

        {/* Add Session */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Session</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Duration (e.g., 30 minutes or in hrs)"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              className="border rounded-lg px-3 py-2 w-1/2"
            />
            <input
              type="text"
              placeholder="Price (in USD)"
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
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Sessions List</h2>
          {sessions.length === 0 ? (
            <p className="text-gray-500">No sessions added yet.</p>
          ) : (
            sessions.map((session, index) => (
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
                        setEditedSession({
                          ...editedSession,
                          duration: e.target.value,
                        })
                      }
                      className="border rounded-lg px-2 py-1 w-1/3"
                    />
                    <input
                      type="text"
                      value={editedSession.price}
                      onChange={(e) =>
                        setEditedSession({
                          ...editedSession,
                          price: e.target.value,
                        })
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
                    <p className="w-1/4 text-right">$. {session.price}</p>
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
            ))
          )}
        </div>

        {/* Save All */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveAllSessions}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Save All Sessions
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
