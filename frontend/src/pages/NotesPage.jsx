import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteEditor from "../components/NoteEditor";
import ReactMarkdown from "react-markdown";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const [filterTag, setFilterTag] = useState("");
  const [sharedKey, setSharedKey] = useState("");
  const [viewHistory, setViewHistory] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [filterTag]);

  const fetchNotes = async () => {
    const { data } = await axios.get("/notes", { params: filterTag ? { tag: filterTag } : {} });
    setNotes(data);
  };

  const deleteNote = async (id) => {
    if (window.confirm("Delete note?")) {
      await axios.delete(`/notes/${id}`);
      fetchNotes();
    }
  };

  const startEdit = (note) => {
    setEditNote(note);
    setViewHistory(null);
  };

  const showHistory = (note) => {
    setViewHistory(note.versions);
    setEditNote(null);
  };

  const shareNote = async (note) => {
    const { data } = await axios.post(`/notes/${note._id}/share`);
    setSharedKey(window.location.origin + "/shared/" + data.sharedKey);
  };

  return (
    <div>
      <h2>Your Notes</h2>
      <input value={filterTag} placeholder="Filter by tag" onChange={e => setFilterTag(e.target.value)} />
      <button onClick={() => setEditNote({})}>New Note</button>
      {sharedKey && <div>Shareable link: <input value={sharedKey} readOnly /></div>}
      {editNote ?
        <NoteEditor note={editNote} onClose={() => { setEditNote(null); fetchNotes(); }} />
        : viewHistory ?
          <div>
            <h3>Version History</h3>
            <ol>
              {viewHistory.map((ver, idx) => (
                <li key={idx}>
                  <small>{new Date(ver.createdAt).toLocaleString()}</small>
                  <ReactMarkdown>{ver.content}</ReactMarkdown>
                </li>
              ))}
            </ol>
            <button onClick={() => setViewHistory(null)}>Close</button>
          </div>
        : null
      }
      <ul>
        {notes.map(note => (
          <li key={note._id} style={{margin:"1em 0",border:"1px solid black",padding:"0.5em"}}>
            <div><b>{note.title}</b> ({note.tags?.join(", ")})</div>
            <ReactMarkdown>{note.content}</ReactMarkdown>
            <button onClick={() => startEdit(note)}>Edit</button>
            <button onClick={() => deleteNote(note._id)}>Delete</button>
            <button onClick={() => shareNote(note)}>Share</button>
            <button onClick={() => showHistory(note)}>History</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
