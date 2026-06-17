import { getUser } from "../../api";
import { useState, useEffect } from "react";
import "./Homecomponents.css";

const BASE = "http://localhost:8000";

export default function SendMessage({ onClose, onSent, replyTo }) {
  const [form, setForm] = useState({
    receiverName: replyTo?.name || "",
    subject:      "",
    body:         "",
  });
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState("");

  // if replyTo changes, update the receiver name field
  useEffect(() => {
    if (replyTo?.name) {
      setForm(prev => ({ ...prev, receiverName: replyTo.name }));
    }
  }, [replyTo]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = async () => {
    if (!form.receiverName.trim() || !form.subject.trim() || !form.body.trim()) {
      setError("All fields are required");
      return;
    }

    const { id, first_name } = getUser();
    if (!id) { setError("Not logged in"); return; }

    setSending(true);
    setError("");

    let receiverId = replyTo?.id;
    let receiverName = replyTo?.name;

    // only do a lookup if this isn't a direct reply (replyTo not provided)
    if (!receiverId) {
      const lookupRes = await fetch(`${BASE}/users/search?name=${form.receiverName}`);
      const receivers = await lookupRes.json();

      if (!Array.isArray(receivers) || receivers.length === 0) {
        setError("User not found — check the name and try again");
        setSending(false);
        return;
      }

      receiverId   = receivers[0].id;
      receiverName = receivers[0].first_name;
    }

    const res = await fetch(`${BASE}/messages/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId:     Number(id),
        receiverId:   receiverId,
        receiverName: receiverName,
        senderName:   first_name || "User",
        subject:      form.subject,
        body:         form.body,
      }),
    });

    if (!res.ok) {
      setError("Failed to send message");
      setSending(false);
      return;
    }

    const saved = await res.json();
    setSending(false);
    onSent(saved);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">
          {replyTo ? `Reply to ${replyTo.name}` : "New Message"}
        </h2>

        <div className="task-form">
          <input
            name="receiverName"
            placeholder="To"
            value={form.receiverName}
            onChange={handleChange}
            disabled={!!replyTo} // lock the field when replying
          />
          <input
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
          />
          <textarea
            name="body"
            placeholder="Write your message..."
            value={form.body}
            onChange={handleChange}
          />
          {error && <p className="msg-error">{error}</p>}
          <button onClick={handleSend} disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}