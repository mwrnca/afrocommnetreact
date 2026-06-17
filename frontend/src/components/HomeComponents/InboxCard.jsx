import { useState } from "react";
import MessageDetail from "./MessageDetail";

import "./Homecomponents.css";

const fmtTime = (ts) => {
  const date = new Date(ts);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  return isToday
    ? date.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("en-KE", { day: "numeric", month: "short" });
};

const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

export default function InboxCard({ message, onRead, onReply }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    if (!message.read && onRead) onRead(message.id);
  };

  const handleReply = (e) => {
    e.stopPropagation(); // don't trigger handleOpen
    if (onReply) onReply(message);
  };

  return (
    <>
      <div
        className={`inbox-card ${!message.read ? "inbox-unread" : ""}`}
        onClick={handleOpen}
      >
        <div className="inbox-avatar">
          {getInitial(message.senderName)}
        </div>

        <div className="inbox-body">
          <div className="inbox-top">
            <span className={`inbox-sender ${!message.read ? "inbox-bold" : ""}`}>
              {message.senderName}
            </span>
            <span className="inbox-time">{fmtTime(message.timestamp)}</span>
          </div>

          <p className="inbox-subject">{message.subject}</p>
          <p className="inbox-preview">{message.body}</p>

          {onReply && (
            <button className="inbox-reply-btn" onClick={handleReply}>
              ↩ Reply
            </button>
          )}
        </div>

        {!message.read && <div className="inbox-dot" />}
      </div>

      {open && (
        <MessageDetail
          message={message}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}