import { useState, useEffect, useRef } from "react";
import { getUser } from "../../api";
import "./Homecomponents.css";

const BASE = "http://localhost:8000";

export default function CommunityRoom({ community, onBack }) {
  const [posts,   setPosts]   = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const { id, first_name } = getUser();

  // fetch posts on mount and every 10 seconds
  useEffect(() => {
    const fetch_posts = () => {
      fetch(`${BASE}/community-posts/${community.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setPosts(data);
        });
    };

    fetch_posts();
    const interval = setInterval(fetch_posts, 10000);
    return () => clearInterval(interval);
  }, [community.id]);

  // scroll to bottom when new posts arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  const handleSend = async () => {
    if (!message.trim() || !id) return;
    setSending(true);

    const res = await fetch(`${BASE}/community-posts/${community.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId:     Number(id),
        senderName: first_name || "User",
        body:       message,
      }),
    });

    if (res.ok) {
      const saved = await res.json();
      setPosts(prev => [...prev, saved]);
      setMessage("");
    }

    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const fmtTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-KE", {
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="community-room">

      {/* header */}
      <div className="room-header">
        <button className="room-back-btn" onClick={onBack}>← Back</button>
        <div className="room-header-info">
          <h3 className="room-name">{community.name}</h3>
          <p className="room-members">👥 {community.members} members</p>
        </div>
        <span className="room-category">{community.category}</span>
      </div>

      {/* messages */}
      <div className="room-messages">
        {posts.length === 0 ? (
          <p className="room-empty">No messages yet — say hello!</p>
        ) : (
          posts.map(post => {
            const isMe = String(post.userId) === String(id);
            return (
              <div
                key={post.id}
                className={`room-bubble-wrap ${isMe ? "room-bubble-mine" : "room-bubble-theirs"}`}
              >
                {!isMe && (
                  <p className="room-sender">{post.senderName}</p>
                )}
                <div className={`room-bubble ${isMe ? "bubble-mine" : "bubble-theirs"}`}>
                  <p className="room-bubble-text">{post.body}</p>
                  <span className="room-bubble-time">{fmtTime(post.timestamp)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="room-input-bar">
        <textarea
          className="room-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className="room-send-btn"
          onClick={handleSend}
          disabled={sending || !message.trim()}
        >
          ➤
        </button>
      </div>

    </div>
  );
}