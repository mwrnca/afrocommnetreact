import { useState, useEffect } from "react";
import InboxCard from "../../components/HomeComponents/InboxCard";
import SendMessage from "../../components/HomeComponents/SendMessage";
import ConversationView from "../../components/HomeComponents/ConversationView";
import { getUser } from "../../api";
import "./Dash.css";

const BASE = "http://localhost:8000";

export default function ProfInbox() {
  const [received,  setReceived]  = useState([]);
  const [sent,      setSent]      = useState([]);
  const [view,      setView]      = useState("received");
  const [composing, setComposing] = useState(false);
  const [replyTo,   setReplyTo]   = useState(null);
  const [viewingPerson, setViewingPerson] = useState(null);

  const { id } = getUser();

  const fetchMessages = () => {
    if (!id) return;
    Promise.all([
      fetch(`${BASE}/messages/${id}/received`).then(r => r.json()),
      fetch(`${BASE}/messages/${id}/sent`).then(r => r.json()),
    ]).then(([receivedData, sentData]) => {
      if (Array.isArray(receivedData)) setReceived(receivedData);
      if (Array.isArray(sentData))     setSent(sentData);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchMessages();
  }, [id]);

  const handleRead = async (messageId) => {
    await fetch(`${BASE}/messages/${messageId}/read`, { method: "PATCH" });
    setReceived(prev =>
      prev.map(m => m.id === messageId ? { ...m, read: true } : m)
    );
  };

  const handleSent = (newMessage) => {
    setSent(prev => [newMessage, ...prev]);
    setReplyTo(null);
  };

  const handleReply = (message) => {
    setReplyTo({ id: message.senderId, name: message.senderName });
    setComposing(true);
  };

  const getPeople = () => {
    const peopleMap = new Map();

    received.forEach(m => {
      if (!peopleMap.has(m.senderId)) {
        peopleMap.set(m.senderId, { id: m.senderId, name: m.senderName });
      }
    });

    sent.forEach(m => {
      if (m.receiverName && !peopleMap.has(m.receiverId)) {
        peopleMap.set(m.receiverId, { id: m.receiverId, name: m.receiverName });
      }
    });

    return Array.from(peopleMap.values());
  };

  const unreadCount = received.filter(m => !m.read).length;
  const messages    = view === "received" ? received : sent;
  const people      = getPeople();

  // ✅ this now correctly renders ONLY the conversation view, replacing the whole inbox
  if (viewingPerson) {
    return (
      <ConversationView
        person={viewingPerson}
        onBack={() => setViewingPerson(null)}
      />
    );
  }

  return (
    <div className="bss-page-container">
      <div className="inbox-header">
        <div className="inbox-title-row">
          <h2 className="inbox-title">Inbox</h2>
          {unreadCount > 0 && <span className="inbox-badge">{unreadCount}</span>}
        </div>
        <button
          className="inbox-compose-btn"
          onClick={() => { setReplyTo(null); setComposing(true); }}
        >
          + Compose
        </button>
      </div>

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
        <button
          className={`inbox-tab ${view === "people" ? "inbox-tab-active" : ""}`}
          onClick={() => setView("people")}
        >
          People
        </button>
      </div>

      {view === "people" ? (
        <div className="inbox-people-list">
          {people.length === 0 ? (
            <p className="inbox-empty">No conversations yet</p>
          ) : (
            people.map(person => (
              <div
                key={person.id}
                className="inbox-person-card"
                // ✅ only opens the conversation view now — compose is separate
                onClick={() => setViewingPerson(person)}
              >
                <div className="inbox-person-avatar">
                  {person.name?.charAt(0) || "?"}
                </div>
                <p className="inbox-person-name">{person.name}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="inbox-list">
          {messages.length === 0 ? (
            <p className="inbox-empty">
              {view === "received" ? "No messages received" : "No messages sent"}
            </p>
          ) : (
            messages.map(message => (
              <InboxCard
                key={message.id}
                message={message}
                onRead={view === "received" ? handleRead : null}
                onReply={view === "received" ? handleReply : null}
              />
            ))
          )}
        </div>
      )}

      {composing && (
        <SendMessage
          replyTo={replyTo}
          onClose={() => { setComposing(false); setReplyTo(null); }}
          onSent={handleSent}
        />
      )}
    </div>
  );
}