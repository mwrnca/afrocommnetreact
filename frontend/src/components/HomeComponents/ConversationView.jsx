import { useState, useEffect, useRef } from "react";
import { getUser } from "../../api";
import "./Homecomponents.css";

const BASE = "http://localhost:8000";

export default function ConversationView({ person, onBack }) {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const bottomRef = useRef(null);

  const { id } = getUser();

  useEffect(() => {
    if (!id || !person?.id) return;

    fetch(`${BASE}/messages/${id}/conversation/${person.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
        setLoading(false);
      });
  }, [id, person]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fmtTime = (ts) =>
    new Date(ts).toLocaleString("en-KE", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  // builds a simple printable HTML doc and triggers print-to-pdf
  const handleDownload = () => {
    const printWindow = window.open("", "_blank");
    const content = messages.map(m => `
      <div style="margin-bottom:12px; padding:10px; border-radius:8px; background:${m.senderId === id ? '#d4af37' : '#1a1d23'}; color:${m.senderId === id ? '#1a1d23' : '#fff'}; max-width:70%; ${m.senderId === id ? 'margin-left:auto;' : ''}">
        <strong>${m.senderName}</strong><br/>
        <span style="font-size:13px;">${m.subject}</span><br/>
        <p style="margin:6px 0;">${m.body}</p>
        <small>${fmtTime(m.timestamp)}</small>
      </div>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Conversation with ${person.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #fff; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          <h2>Conversation with ${person.name}</h2>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="community-room"> {/* reuse the same chat-style layout */}
      <div className="room-header">
        <button className="room-back-btn" onClick={onBack}>← Back</button>
        <div className="room-header-info">
          <h3 className="room-name">{person.name}</h3>
          <p className="room-members">{messages.length} messages</p>
        </div>
        <button className="room-back-btn" onClick={handleDownload}>
          ⬇ Download PDF
        </button>
      </div>

      <div className="room-messages">
        {loading ? (
          <p className="room-empty">Loading conversation...</p>
        ) : messages.length === 0 ? (
          <p className="room-empty">No messages yet</p>
        ) : (
          messages.map(m => {
            const isMe = m.senderId === id;
            return (
              <div
                key={m.id}
                className={`room-bubble-wrap ${isMe ? "room-bubble-mine" : "room-bubble-theirs"}`}
              >
                {!isMe && <p className="room-sender">{m.senderName}</p>}
                <div className={`room-bubble ${isMe ? "bubble-mine" : "bubble-theirs"}`}>
                  <p className="room-bubble-text"><strong>{m.subject}</strong></p>
                  <p className="room-bubble-text">{m.body}</p>
                  <span className="room-bubble-time">{fmtTime(m.timestamp)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}