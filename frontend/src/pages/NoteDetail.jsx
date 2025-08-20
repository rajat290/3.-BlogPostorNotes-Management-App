import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";

// TipTap
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// Icons
import { Bold, Italic, List, ListOrdered, Heading1, Heading2 } from "lucide-react";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: [],
  });
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState("");

  // TipTap editor (content is set after fetch)
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] p-3 focus:outline-none prose dark:prose-invert max-w-none",
      },
    },
  });

  const fetchNote = async () => {
    try {
      const res = await api.get(`/notes/${id}`);
      const n = res.data;
      setNote(n);
      const tagsArray = Array.isArray(n.tags)
        ? n.tags
        : n.tags
        ? [n.tags]
        : [];
      setForm({
        title: n.title || "",
        content: n.content || "",
        category: n.category || "General",
        tags: tagsArray,
      });
      // set editor content
      if (editor) editor.commands.setContent(n.content || "");
    } catch (e) {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    fetchNote();
    // re-run setContent after editor mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, editor]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleTagAdd = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = e.currentTarget.value.trim();
      if (val && !form.tags.includes(val)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, val] }));
      }
      e.currentTarget.value = "";
    }
  };

  const removeTag = (t) =>
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));

  const saveNote = async () => {
    if (!editor) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        content: editor.getHTML(), // take TipTap HTML
        category: form.category,
        tags: form.tags,
      };
      await api.put(`/notes/${id}`, payload);
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
                  onClick={() => {
                    setEdit(false);
                    // revert unsaved changes
                    setForm((prev) => ({
                      ...prev,
                      title: note.title || "",
                      category: note.category || "General",
                      tags: Array.isArray(note.tags)
                        ? note.tags
                        : note.tags
                        ? [note.tags]
                        : [],
                    }));
                    if (editor) editor.commands.setContent(note.content || "");
                  }}
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
              placeholder="Title..."
              className="w-full text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none p-1 mb-2 dark:text-white"
            />
          )}

          {/* Meta */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date(note.updatedAt || note.createdAt).toLocaleString()} •{" "}
            {form.category || "General"}
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
                  <button
                    onClick={() => removeTag(t)}
                    className="text-indigo-700 dark:text-indigo-200"
                  >
                    ×
                  </button>
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
            <>
              {/* Toolbar */}
              {editor && (
                <div className="flex flex-wrap gap-2 p-2 border rounded-t-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={`p-2 rounded ${
                      editor.isActive("heading", { level: 1 })
                        ? "bg-indigo-200 dark:bg-indigo-700"
                        : ""
                    }`}
                    title="Heading 1"
                  >
                    <Heading1 size={16} />
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`p-2 rounded ${
                      editor.isActive("heading", { level: 2 })
                        ? "bg-indigo-200 dark:bg-indigo-700"
                        : ""
                    }`}
                    title="Heading 2"
                  >
                    <Heading2 size={16} />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded ${
                      editor.isActive("bold")
                        ? "bg-indigo-200 dark:bg-indigo-700"
                        : ""
                    }`}
                    title="Bold"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded ${
                      editor.isActive("italic")
                        ? "bg-indigo-200 dark:bg-indigo-700"
                        : ""
                    }`}
                    title="Italic"
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    className={`p-2 rounded ${
                      editor.isActive("bulletList")
                        ? "bg-indigo-200 dark:bg-indigo-700"
                        : ""
                    }`}
                    title="Bullet list"
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    className={`p-2 rounded ${
                      editor.isActive("orderedList")
                        ? "bg-indigo-200 dark:bg-indigo-700"
                        : ""
                    }`}
                    title="Numbered list"
                  >
                    <ListOrdered size={16} />
                  </button>
                </div>
              )}

              {/* Editor */}
              <div className="rounded-b-xl bg-white dark:bg-gray-700 dark:text-white shadow">
                <EditorContent editor={editor} />
              </div>
            </>
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
