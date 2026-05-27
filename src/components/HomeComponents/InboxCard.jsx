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

export default function InboxCard({ message, onRead }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    if (!message.read) onRead(message.id);
  };

  return (
    <>
      <div
        className={`inbox-card ${!message.read ? "inbox-unread" : ""}`}
        onClick={handleOpen}
      >
        {/* avatar — circle with sender's first initial */}
        <div className="inbox-avatar">
          {getInitial(message.senderName)}
        </div>

        <div className="inbox-body">
          <div className="inbox-top">
            {/* sender name — bold if unread */}
            <span className={`inbox-sender ${!message.read ? "inbox-bold" : ""}`}>
              {message.senderName}
            </span>

            {/* timestamp — today shows time, older shows date */}
            <span className="inbox-time">{fmtTime(message.timestamp)}</span>
          </div>

          {/* subject line */}
          <p className="inbox-subject">{message.subject}</p>

          {/* message preview — truncated with CSS */}
          <p className="inbox-preview">{message.body}</p>
        </div>

        {/* unread blue dot — only shows if message.read is false */}
        {!message.read && <div className="inbox-dot" />}
      </div>

      {/* MessageDetail opens as a modal when open is true */}
      {open && (
        <MessageDetail
          message={message}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}