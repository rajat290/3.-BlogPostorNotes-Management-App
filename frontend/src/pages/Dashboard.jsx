import { useEffect, useState } from "react";
import axios from "../api/axios";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("/notes");
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, []);

  // Create new note
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/notes", { title, content });
      setNotes([res.data, ...notes]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>

      <form onSubmit={handleCreate} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ marginRight: "1rem" }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={3}
          style={{ marginRight: "1rem" }}
        />
        <button type="submit">Add Note</button>
      </form>

      <div>
        {notes.map((note) => (
          <div
            key={note._id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleDelete(note._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
