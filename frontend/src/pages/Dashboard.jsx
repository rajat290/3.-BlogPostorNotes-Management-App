import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, setUser, setToken } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data.notes || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0">
        <h1 className="text-xl font-bold text-indigo-600">📒 MyNotes</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-center text-gray-600">
            No notes yet. Create your first one!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-xl transition cursor-pointer"
              >
                <h2 className="text-lg font-bold text-gray-800">
                  {note.title}
                </h2>
                <p className="text-gray-600 mt-2 line-clamp-3">
                  {note.content}
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => navigate(`/edit-note/${note._id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await api.delete(`/notes/${note._id}`);
                        setNotes(notes.filter((n) => n._id !== note._id)); // remove from UI
                      } catch (err) {
                        console.error("Delete failed:", err);
                      }
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => navigate("/add-note")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl shadow-lg hover:bg-indigo-700 transition"
      >
        +
      </button>
    </div>
  );
}
