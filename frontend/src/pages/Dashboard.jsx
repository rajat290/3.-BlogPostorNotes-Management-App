import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Dashboard() {
  const { user, setUser, setToken } = useContext(AuthContext);
  const { dark, setDark } = useContext(ThemeContext);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md sticky top-0">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          📒 MyNotes
        </h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-lg"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {user?.name}
          </span>
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
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading notes...
          </p>
        ) : filteredNotes.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No notes found. Try creating or searching!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-5 hover:shadow-xl transition relative"
              >
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  {note.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                  {note.content}
                </p>
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
