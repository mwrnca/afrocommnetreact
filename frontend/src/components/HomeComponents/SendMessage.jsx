import { getUser } from "../../api";
import { useState } from "react";
import "./Homecomponents.css";

export default function SendMessage({ onClose, onSent }) {
  const [form, setForm] = useState({
    receiverName: "",
    subject: "",
    body: "",
  });

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const { id, name } = getUser();
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = async () => {
    if (!form.receiverName.trim() || !form.subject.trim() || !form.body.trim()) {
      setError("All fields are required");
      return;
    }

    setError("");
    setSending(true);

    const res = await fetch("http://localhost:3001/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId:   Number(id),
        receiverId: 0,         // you'll need receiver lookup — for now 0
        senderName: name,
        receiverName: form.receiverName,
        subject: form.subject,
        body: form.body,
        timestamp: new Date().toISOString(),
        read: true,
      }),
    });

    const saved = await res.json();

    setSending(false);

    onSent(saved);

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">New Message</h2>

        <div className="task-form">
          <input
            name="receiverName"
            placeholder="To"
            value={form.receiverName}
            onChange={handleChange}
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