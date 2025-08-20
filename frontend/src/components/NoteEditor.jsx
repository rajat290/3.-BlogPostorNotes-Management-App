import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

const NoteEditor = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const handleSave = () => {
    if (!title || !editor.getHTML()) {
      return alert("Please add both title and content!");
    }

    const tagList = tags.split(",").map((tag) => tag.trim());

    onSave({
      title,
      content: editor.getHTML(),
      tags: tagList,
    });

    setTitle("");
    setTags("");
    editor.commands.setContent("");
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-lg mb-6">
      {/* Title */}
      <input
        type="text"
        placeholder="Enter note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-3 rounded-lg text-black"
      />

      {/* Toolbar */}
      {editor && (
        <div className="flex gap-2 p-2 border-b border-gray-700 bg-gray-800 rounded-t-xl mb-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${
              editor.isActive("bold") ? "bg-indigo-700" : ""
            }`}
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${
              editor.isActive("italic") ? "bg-indigo-700" : ""
            }`}
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${
              editor.isActive("bulletList") ? "bg-indigo-700" : ""
            }`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${
              editor.isActive("orderedList") ? "bg-indigo-700" : ""
            }`}
          >
            <ListOrdered size={16} />
          </button>
        </div>
      )}

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="bg-white text-black min-h-[150px] p-3 rounded-lg mb-3 prose max-w-none"
      />

      {/* Tags */}
      <input
        type="text"
        placeholder="Add tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full p-2 mb-3 rounded-lg text-black"
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-3 px-4 py-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500"
      >
        Save Note
      </button>
    </div>
  );
};

export default NoteEditor;
