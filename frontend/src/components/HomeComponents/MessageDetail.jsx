import { useState } from "react";
import "./Homecomponents.css";

const fmtFull = (ts) =>
  new Date(ts).toLocaleString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function MessageDetail({ message, onClose }) {

  const [reply, setReply] = useState("");
  
  const [sending, setSending] = useState(false);
  
  const [sent, setSent] = useState(false);

  // replace handleReply with:
const handleReply = async () => {
  if (!reply.trim()) return;
  setSending(true);
  const { id, name } = getUser();  // import getUser from "../../api"

  await fetch(`http://localhost:8000/messages/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      senderId:   Number(id),
      receiverId: message.senderId,
      senderName: name,
      subject:    `Re: ${message.subject}`,
      body:       reply,
    }),
  });

  setSending(false);
  setSent(true);
  setReply("");
  setTimeout(() => setSent(false), 2000);
};
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="msg-header">
          <div className="inbox-avatar large">
            {message.senderName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="msg-sender">{message.senderName}</p>
            <p className="msg-time">{fmtFull(message.timestamp)}</p>
          </div>
        </div>

        {/* subject */}
        <h2 className="msg-subject">{message.subject}</h2>

        {/* full message body */}
        <p className="msg-body">{message.body}</p>

        {/* reply section */}
        <div className="msg-reply">
          <textarea
            placeholder={`Reply to ${message.senderName}...`}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="msg-reply-input"
          />

          {/* sent confirmation — shows briefly after sending */}
          {sent && <p className="msg-sent-confirm">Reply sent!</p>}

          <button
            className="msg-reply-btn"
            onClick={handleReply}
            // disabled while sending to prevent double submit
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Reply"}
          </button>
        </div>

      </div>
    </div>
  );
}