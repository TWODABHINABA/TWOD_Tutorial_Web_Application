import { useEffect, useState } from "react";
import api from "../../components/User-management/api";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { ClipLoader } from "react-spinners";

export default function ManageSessionPricing() {
  const [sessions, setSessions] = useState([]);
  const [newDuration, setNewDuration] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [newFeatures, setNewFeatures] = useState([]);
  const [editedSession, setEditedSession] = useState({
    duration: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

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

  const handleAddSession = () => {
    if (!newDuration || !newPrice)
      return alert("Please enter both duration and price");

    const updatedSessions = [
      ...sessions,
      { duration: newDuration, price: newPrice, features: newFeatures },
    ];
    setSessions(updatedSessions);
    setNewDuration("");
    setNewPrice("");
    setNewFeatures([]);
  };

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

  const handleSaveEdit = (index) => {
    const updatedSessions = [...sessions];
    updatedSessions[index] = editedSession;
    setSessions(updatedSessions);
    setEditIndex(null);
  };

  const handleDeleteSession = (index) => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;
    const updatedSessions = sessions.filter((_, i) => i !== index);
    setSessions(updatedSessions);
  };
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={80} color="#FFA500" />
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 bg-gray-100 rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Manage Session Pricing
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Add New Session
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Duration (e.g., 30 mins, 1 hr)"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              className="border rounded-lg px-4 py-3 text-lg w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Price (USD)"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="border rounded-lg px-4 py-3 text-lg w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Features (comma-separated)"
              value={newFeatures.join(", ")}
              onChange={(e) =>
                setNewFeatures(e.target.value.split(",").map((f) => f.trim()))
              }
              className="border rounded-lg px-4 py-3 text-lg w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddSession}
              className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-6 py-3 rounded-lg transition duration-300"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Sessions List
          </h2>
          {sessions.length === 0 ? (
            <p className="text-gray-500 text-lg">No sessions added yet.</p>
          ) : (
            sessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b py-3 gap-6 text-lg"
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
                      className="border rounded-lg px-3 py-2 w-1/3 text-lg"
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
                      className="border rounded-lg px-3 py-2 w-1/4 text-right text-lg"
                    />
                    <input
                      type="text"
                      value={editedSession.features.join(", ")}
                      onChange={(e) =>
                        setEditedSession({
                          ...editedSession,
                          features: e.target.value
                            .split(",")
                            .map((f) => f.trim()),
                        })
                      }
                      className="border rounded-lg px-3 py-2 w-1/3 text-lg"
                      placeholder="Enter features"
                    />
                    <button
                      onClick={() => handleSaveEdit(index)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditIndex(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p className="font-medium w-1/3 text-gray-800">
                      {session.duration}
                    </p>
                    <p className="w-1/4 text-right font-semibold text-green-700">
                      $ {session.price}
                    </p>
                    <p className="w-1/3 text-gray-600">
                      {session.features.length > 0
                        ? session.features.join(", ")
                        : "No features listed"}
                    </p>
                    <button
                      onClick={() => handleEditClick(index)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSession(index)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveAllSessions}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-6 py-3 rounded-lg transition duration-300"
          >
            Save All Sessions
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
