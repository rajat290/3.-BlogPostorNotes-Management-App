import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";

// TipTap
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";import Color from "@tiptap/extension-color";
import Typography from "@tiptap/extension-typography";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";

// Icons
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Code,
  Code2,
  Quote,
  List as BulletList,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Redo2,
  Undo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  X,
  Palette,
} from "lucide-react";

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

  // Fetch note
  const fetchNote = async () => {
    try {
      const res = await api.get(`/notes/${id}`);
      const n = res.data;
      setNote(n);
      setForm({
        title: n.title || "",
        content: n.content || "", // assumes HTML string is stored
        category: n.category || "General",
        tags: Array.isArray(n.tags) ? n.tags : n.tags ? [n.tags] : [],
      });
    } catch (e) {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
        codeBlock: true,
      }),
      Underline,
      Link.configure({
        autolink: true,
        openOnClick: true,
        linkOnPaste: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: "Write your note… Use / for commands (bold, list, image, etc.)",
      }),
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextStyle,
      Color,
      Typography,
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: form.content || "",
    onUpdate: ({ editor }) => {
      // keep form.content in sync
      const html = editor.getHTML();
      setForm((f) => ({ ...f, content: html }));
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] prose dark:prose-invert max-w-none focus:outline-none p-4 rounded-xl bg-white dark:bg-gray-700 dark:text-white",
      },
    },
  });

  // when we toggle edit ON, load content into editor
  useEffect(() => {
    if (editor && edit) {
      editor.commands.setContent(form.content || "");
    }
  }, [edit, editor]); // eslint-disable-line

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTagAdd = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = e.currentTarget.value.trim();
      if (val && !form.tags.includes(val)) setForm({ ...form, tags: [...form.tags, val] });
      e.currentTarget.value = "";
    }
  };

  const removeTag = (t) => setForm({ ...form, tags: form.tags.filter((x) => x !== t) });

  const saveNote = async () => {
    if (edit && editor) {
      // ensure latest HTML
      const html = editor.getHTML();
      setForm((f) => ({ ...f, content: html }));
    }
    setSaving(true);
    try {
      await api.put(`/notes/${id}`, { ...form });
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

  const Toolbar = useMemo(() => {
    if (!editor) return null;

    const isActive = (attr, opts) => editor.isActive(attr, opts);

    const onSetLink = () => {
      const prev = editor.getAttributes("link")?.href || "";
      const url = window.prompt("Paste URL", prev);
      if (url === null) return; // cancelled
      if (url === "") {
        editor.chain().focus().unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const onUnsetLink = () => editor.chain().focus().unsetLink().run();

    const addImage = () => {
      const url = window.prompt("Image URL");
      if (!url) return;
      editor.chain().focus().setImage({ src: url, alt: "" }).run();
    };

    return (
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-xl">
        {/* Undo/Redo */}
        <IconBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 className="w-4 h-4" />
        </IconBtn>
        <IconBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 className="w-4 h-4" />
        </IconBtn>

        <Divider />

        {/* Headings */}
        <IconBtn
          title="Heading 1"
          active={isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Heading 2"
          active={isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Heading 3"
          active={isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="w-4 h-4" />
        </IconBtn>

        <Divider />

        {/* Marks */}
        <IconBtn
          title="Bold"
          active={isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Italic"
          active={isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Underline"
          active={isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Strike"
          active={isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Highlight"
          active={isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="w-4 h-4" />
        </IconBtn>
        <IconBtn title="Code" active={isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Code Block"
          active={isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Blockquote"
          active={isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="w-4 h-4" />
        </IconBtn>

        <Divider />

        {/* Lists */}
        <IconBtn
          title="Bullet List"
          active={isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <BulletList className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Ordered List"
          active={isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Task List"
          active={isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <CheckSquare className="w-4 h-4" />
        </IconBtn>

        <Divider />

        {/* Alignment */}
        <IconBtn title="Align Left" active={isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Align Center"
          active={isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Align Right"
          active={isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="w-4 h-4" />
        </IconBtn>
        <IconBtn
          title="Justify"
          active={isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="w-4 h-4" />
        </IconBtn>

        <Divider />

        {/* Link & Image */}
        <IconBtn title="Set Link" active={isActive("link")} onClick={onSetLink}>
          <LinkIcon className="w-4 h-4" />
        </IconBtn>
        <IconBtn title="Remove Link" onClick={onUnsetLink}>
          <X className="w-4 h-4" />
        </IconBtn>
        <IconBtn title="Insert Image" onClick={addImage}>
          <ImageIcon className="w-4 h-4" />
        </IconBtn>

        <Divider />

        {/* Color */}
        <div className="flex items-center gap-2 pl-1 pr-2 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
          <Palette className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          <input
            type="color"
            title="Text Color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="h-7 w-8 cursor-pointer bg-transparent border-0 outline-none"
          />
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }, [editor]);

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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Title */}
          <div className="p-6 pb-0">
            {!edit ? (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {note.title || "Untitled"}
              </h1>
            ) : (
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title…"
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
          </div>

          {/* Editor / Viewer */}
          <div className="mt-4">
            {!edit ? (
              <div
                className="p-6 pt-2 prose dark:prose-invert max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            ) : (
              <>
                {Toolbar}
                <EditorContent editor={editor} className="px-4 pb-6" />
              </>
            )}
          </div>
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

/* —————— Small UI helpers —————— */
function IconBtn({ title, onClick, children, active, disabled }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={[
        "h-8 px-2 rounded-md border text-sm inline-flex items-center justify-center gap-1",
        "border-gray-200 dark:border-gray-600",
        active
          ? "bg-indigo-600 text-white"
          : "bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-600",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-8 bg-gray-200 dark:bg-gray-600 mx-1" />;
}
