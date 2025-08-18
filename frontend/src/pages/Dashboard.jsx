import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Dashboard() {
  const { user, setUser, setToken } = useContext(AuthContext);
  const { dark, setDark } = useContext(ThemeContext);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");

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

  const handleAddNote = async () => {
    if (!title && !content) return;
    try {
      const res = await api.post("/notes", { title, content, tag });
      setNotes([res.data.note, ...notes]); // new note on top
      setTitle("");
      setContent("");
      setTag("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative z-20 w-64 bg-white dark:bg-gray-800 shadow-lg md:translate-x-0 transition-transform`}
      >
        <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
          <h2 className="font-bold text-indigo-600 dark:text-indigo-400">
            📚 My Notes
          </h2>
          <button
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
        </div>
        <ul className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-80px)]">
          {notes.map((note) => (
            <li
              key={note._id}
              onClick={() => navigate(`/note/${note._id}`)}
              className="cursor-pointer p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {note.title || "Untitled"}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
          <button
            className="md:hidden px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
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

        {/* Input Box with Quill */}
        <div className="max-w-4xl mx-auto mt-6 w-full px-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg">
            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none p-2 mb-3 dark:text-white"
            />
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="bg-white dark:bg-gray-700 dark:text-white rounded-xl shadow"
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ align: [] }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
            />
            <div className="flex justify-between items-center mt-3">
              <input
                type="text"
                placeholder="Tag (e.g. Work, Personal)"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Recent Notes */}
        <main className="max-w-5xl mx-auto p-6 w-full">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Recent Notes
          </h2>
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          ) : notes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No notes yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => navigate(`/note/${note._id}`)}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-5 hover:shadow-xl transition"
                >
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                    {note.title}
                  </h3>
                  <div
                    className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                  {note.tag && (
                    <span className="mt-3 inline-block px-2 py-1 text-sm bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-200 rounded">
                      #{note.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
