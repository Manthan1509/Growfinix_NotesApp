import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function SharedNotePage() {
  const { key } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    axios.get(`/notes/shared/${key}`)
      .then(res => setNote(res.data))
      .catch(() => setNote(null));
  }, [key]);

  if (!note) return <div>Note not found or not shared.</div>;
  return (
    <div>
      <h2>{note.title}</h2>
      <ReactMarkdown>{note.content}</ReactMarkdown>
      <h4>Version History</h4>
      <ol>
        {note.versions.map((v, i) =>
          <li key={i}>
            <small>{new Date(v.createdAt).toLocaleString()}</small>:<ReactMarkdown>{v.content}</ReactMarkdown>
          </li>
        )}
      </ol>
    </div>
  );
}
