import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NoteEditor = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSave = () => {
    if (!title || !content) {
      return alert("Please add both title and content!");
    }

    // tags ko array me convert kar dena
    const tagList = tags.split(",").map((tag) => tag.trim());

    onSave({ title, content, tags: tagList });

    // reset form
    setTitle("");
    setContent("");
    setTags("");
  };

  // Quill toolbar config
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
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

      {/* Editor */}
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        className="bg-white text-black rounded-lg mb-3"
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
