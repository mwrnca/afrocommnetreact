// useState for messages list, compose modal, and unread count
// useEffect to fetch messages when page loads
import { useState, useEffect } from "react";

import InboxCard from "../../components/HomeComponents/InboxCard";
import SendMessage from "../../components/HomeComponents/SendMessage";
import "./Dash.css";

export default function Inbox() {
  // holds all messages fetched from db.json
  const [messages, setMessages] = useState([]);

  // controls whether the compose modal is open
  const [composing, setComposing] = useState(false);

  // fetch all messages for the logged in user on mount
  // in a real app you'd filter by receiverId matching logged in user
  useEffect(() => {
    fetch("http://localhost:3001/messages")
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  // called by InboxCard when a message is opened
  // marks it as read in db.json and updates the UI
  const handleRead = async (id) => {
    // PATCH only updates the specific field we pass
    await fetch(`http://localhost:3001/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });

    // update the message in state so the unread dot disappears instantly
    setMessages(prev =>
      prev.map(m => m.id === id ? { ...m, read: true } : m)
    );
  };

  // called by SendMessage when a new message is sent
  // adds it to the list immediately without refetching
  const handleSent = (newMessage) => {
    setMessages(prev => [newMessage, ...prev]);
  };

  // count how many messages are unread for the badge
  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="inbox-page">

      {/* header row — title, unread count, compose button */}
      <div className="inbox-header">
        <div className="inbox-title-row">
          <h2 className="inbox-title">Inbox</h2>

          {/* only show badge if there are unread messages */}
          {unreadCount > 0 && (
            <span className="inbox-badge">{unreadCount}</span>
          )}
        </div>

        {/* opens the compose modal */}
        <button
          className="inbox-compose-btn"
          onClick={() => setComposing(true)}
        >
          + Compose
        </button>
      </div>

      {/* message list — each message gets a card */}
      <div className="inbox-list">
        {messages.length === 0
          ? <p className="inbox-empty">No messages</p>
          : messages.map(message => (
              <InboxCard
                key={message.id}
                message={message}
                onRead={handleRead}
              />
            ))
        }
      </div>

      {/* compose modal — only renders when composing is true */}
      {composing && (
        <SendMessage
          onClose={() => setComposing(false)}
          onSent={handleSent}
        />
      )}

    </div>
  );
}