// PublicPostForm.jsx — show only if user.is_verified
import { useState } from "react";
import { getUser } from "../../api";

const BASE = "http://localhost:8000";

export default function PublicPostForm() {
  const [body, setBody] = useState("");
  const [msg,  setMsg]   = useState("");
  const { id } = getUser();

  const handlePost = async () => {
    if (!body.trim()) return;

    const res = await fetch(`${BASE}/public-posts/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });

    if (res.ok) {
      setMsg("Posted to public channel");
      setBody("");
    } else {
      const err = await res.json();
      setMsg(err.detail || "Failed to post");
    }
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="task-form">
      <textarea
        placeholder="Share something with the public (visible on landing page)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      {msg && <p className="msg-error">{msg}</p>}
      <button onClick={handlePost}>Post Publicly</button>
    </div>
  );
}