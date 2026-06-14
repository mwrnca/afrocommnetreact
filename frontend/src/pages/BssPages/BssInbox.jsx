import { useState, useEffect } from "react";
import InboxCard from "../../components/HomeComponents/InboxCard";
import SendMessage from "../../components/HomeComponents/SendMessage";
import { getUser } from "../../api";
import "./Dash.css";

export default function BssInbox() {
  const [received,  setReceived]  = useState([]);
  const [sent,      setSent]      = useState([]);
  const [view,      setView]      = useState("received"); // "received" or "sent"
  const [composing, setComposing] = useState(false);

  useEffect(() => {
    const { id } = getUser();
    if (!id) return;

    // fetch both at once
    Promise.all([
      fetch(`http://localhost:8000/messages/${id}/received`).then(r => r.json()),
      fetch(`http://localhost:8000/messages/${id}/sent`).then(r => r.json()),
    ]).then(([receivedData, sentData]) => {
      if (Array.isArray(receivedData)) setReceived(receivedData);
      if (Array.isArray(sentData))     setSent(sentData);
    }).catch(() => {});
  }, []);

  const handleRead = async (messageId) => {
    await fetch(`http://localhost:8000/messages/${messageId}/read`, {
      method: "PATCH",
    });
    setReceived(prev =>
      prev.map(m => m.id === messageId ? { ...m, read: true } : m)
    );
  };

  const handleSent = (newMessage) => {
    setSent(prev => [newMessage, ...prev]);
  };

  const unreadCount = received.filter(m => !m.read).length;
  const messages    = view === "received" ? received : sent;

  return (
    <div className="bss-page-container">
      <div className="inbox-header">
        <div className="inbox-title-row">
          <h2 className="inbox-title">Inbox</h2>
          {unreadCount > 0 && (
            <span className="inbox-badge">{unreadCount}</span>
          )}
        </div>
        <button
          className="inbox-compose-btn"
          onClick={() => setComposing(true)}
        >
          + Compose
        </button>
      </div>

      {/* toggle tabs */}
      <div className="inbox-tabs">
        <button
          className={`inbox-tab ${view === "received" ? "inbox-tab-active" : ""}`}
          onClick={() => setView("received")}
        >
          Received
        </button>
        <button
          className={`inbox-tab ${view === "sent" ? "inbox-tab-active" : ""}`}
          onClick={() => setView("sent")}
        >
          Sent
        </button>
      </div>

      <div className="inbox-list">
        {messages.length === 0
          ? <p className="inbox-empty">
              {view === "received" ? "No messages received" : "No messages sent"}
            </p>
          : messages.map(message => (
              <InboxCard
                key={message.id}
                message={message}
                onRead={view === "received" ? handleRead : null}
              />
            ))
        }
      </div>

      {composing && (
        <SendMessage
          onClose={() => setComposing(false)}
          onSent={handleSent}
        />
      )}
    </div>
  );
}