import { useState, useEffect } from "react";
import InboxCard from "../../components/HomeComponents/InboxCard";
import SendMessage from "../../components/HomeComponents/SendMessage";
import { getUser } from "../../api";
import "./Dash.css";

export default function BssInbox() {
  const [messages,  setMessages]  = useState([]);
  const [composing, setComposing] = useState(false);

  useEffect(() => {
    const { id } = getUser();
    if (!id) return;

    fetch(`http://localhost:8000/messages/${id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
        else setMessages([]);
      })
      .catch(() => setMessages([]));
  }, []);

  const handleRead = async (messageId) => {
    await fetch(`http://localhost:8000/messages/${messageId}/read`, {
      method: "PATCH",
    });

    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, read: true } : m)
    );
  };

  const handleSent = (newMessage) => {
    setMessages(prev => [newMessage, ...prev]);
  };

  const unreadCount = messages.filter(m => !m.read).length;

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

      {composing && (
        <SendMessage
          onClose={() => setComposing(false)}
          onSent={handleSent}
        />
      )}
    </div>
  );
}