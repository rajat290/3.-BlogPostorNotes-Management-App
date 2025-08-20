import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

// Tiptap imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
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

export default function Dashboard() {
  const { user, setUser, setToken } = useContext(AuthContext);
  const { dark, setDark } = useContext(ThemeContext);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [title, setTitle] = useState("");
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

  // ✅ Full-featured Tiptap Editor
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
    content: "",
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] prose dark:prose-invert max-w-none focus:outline-none p-4 rounded-xl bg-white dark:bg-gray-700 dark:text-white",
      },
    },
  });

  const handleAddNote = async () => {
    if (!title && !editor.getHTML()) return;
    try {
      const res = await api.post("/notes", {
        title,
        content: editor.getHTML(),
        tag,
      });

      const newNote = res.data.note || res.data;
      if (!newNote) throw new Error("Invalid response from server");

      setNotes([newNote, ...notes]);
      setTitle("");
      setTag("");
      editor.commands.setContent("");
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  // Toolbar component
  const Toolbar = useMemo(() => {
    if (!editor) return null;

    const isActive = (attr, opts) => editor.isActive(attr, opts);

    const onSetLink = () => {
      const prev = editor.getAttributes("link")?.href || "";
      const url = window.prompt("Paste URL", prev);
      if (url === null) return;
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

        {/* Input Box with Full-featured Editor */}
        <div className="max-w-4xl mx-auto mt-6 w-full px-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg">
            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none p-2 mb-3 dark:text-white"
            />

            {/* Full Toolbar */}
            {editor && Toolbar}

            {/* Editor */}
            <EditorContent
              editor={editor}
              className="bg-white dark:bg-gray-700 dark:text-white rounded-xl shadow min-h-[280px] p-4 prose dark:prose-invert max-w-none"
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
