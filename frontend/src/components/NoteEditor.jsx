import React, { useState } from "react";
import axios from "axios";

export default function NoteEditor({ note, onClose }) {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const [tags, setTags] = useState(note.tags ? note.tags.join(",") : "");
  const isEdit = note._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, content, tags: tags.split(",").map(t => t.trim()).filter(Boolean) };
    if (isEdit) {
      await axios.put(`/notes/${note._id}`, payload);
    } else {
      await axios.post("/notes", payload);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{margin:"1em 0",padding:"1em",border:"1px solid blue"}}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} placeholder="Content (Markdown supported)" required />
      <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" />
      <button type="submit">{isEdit ? "Update" : "Create"} Note</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
}
