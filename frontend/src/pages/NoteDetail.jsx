import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "", tags: [] });
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState("");

  const fetchNote = async () => {
    try {
      const res = await api.get(`/notes/${id}`);
      const n = res.data;
      setNote(n);
      setForm({
        title: n.title || "",
        content: n.content || "",
        category: n.category || "General",
        tags: Array.isArray(n.tags) ? n.tags : (n.tags ? [n.tags] : []),
      });
    } catch (e) {
      navigate("/dashboard");
    }
  };

  useEffect(() => { fetchNote(); }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTagAdd = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = e.currentTarget.value.trim();
      if (val && !form.tags.includes(val)) setForm({ ...form, tags: [...form.tags, val] });
      e.currentTarget.value = "";
    }
  };

  const removeTag = (t) => setForm({ ...form, tags: form.tags.filter(x => x !== t) });

  const saveNote = async () => {
    setSaving(true);
    try {
      await api.put(`/notes/${id}`, form);
      setToast("Saved ✓");
      setEdit(false);
      await fetchNote();
      setTimeout(() => setToast(""), 1500);
    } catch {
      setToast("Save failed");
      setTimeout(() => setToast(""), 1500);
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async () => {
    try {
      await api.delete(`/notes/${id}`);
      navigate("/dashboard");
    } catch {
      setConfirmOpen(false);
    }
  };

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header actions */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded-lg border dark:border-gray-700 dark:text-gray-200"
          >
            ← Back
          </button>

          <div className="flex gap-3">
            {!edit ? (
              <>
                <button
                  onClick={() => setEdit(true)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEdit(false)}
                  className="px-4 py-2 rounded-lg border dark:border-gray-700"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  onClick={saveNote}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          {/* Title */}
          {!edit ? (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {note.title || "Untitled"}
            </h1>
          ) : (
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none p-1 mb-2 dark:text-white"
            />
          )}

          {/* Meta */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date(note.updatedAt || note.createdAt).toLocaleString()} • {form.category || "General"}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {(edit ? form.tags : note.tags || []).map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 px-2 py-1 text-xs rounded bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200"
              >
                #{t}
                {edit && (
                  <button onClick={() => removeTag(t)} className="text-indigo-700 dark:text-indigo-200">×</button>
                )}
              </span>
            ))}
          </div>

          {edit && (
            <input
              placeholder="Add tag and press Enter"
              onKeyDown={handleTagAdd}
              className="mt-2 w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          )}

          {/* Content */}
          {!edit ? (
            <div
              className="mt-6 prose dark:prose-invert max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          ) : (
            <ReactQuill
              value={form.content}
              onChange={(val) => setForm({ ...form, content: val })}
              className="mt-6 bg-white dark:bg-gray-700 dark:text-white rounded-xl shadow"
              theme="snow"
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
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete note?"
        message="This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteNote}
      />
    </div>
  );
}
