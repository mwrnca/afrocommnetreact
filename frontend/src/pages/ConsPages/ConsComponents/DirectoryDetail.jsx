import { useState } from "react";
import "./ConsumerComponents.css";

const getName = (user) =>
  user.name_of_business || `${user.first_name} ${user.second_name}`;

const getCategory = (user) =>
  user.nature_of_business || user.role;

export default function DirectoryDetail({ user, onClose }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const loggedIn = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);

    await fetch(`http://localhost:8000/messages/${loggedIn.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId:   loggedIn.id,
        receiverId: user.id,
        senderName: `${loggedIn.first_name} ${loggedIn.second_name}`,
        subject:    `Message from ${loggedIn.first_name}`,
        body:       message,
      }),
    });

    setSending(false);
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="dir-overlay" onClick={onClose}>
      <div className="dir-detail" onClick={(e) => e.stopPropagation()}>

        {/* close button */}
        <button className="dir-close" onClick={onClose}>✕</button>

        {/* image / avatar */}
        <div className="dir-detail-image">
          {user.profile_image
            ? <img src={user.profile_image} alt={getName(user)} />
            : <div className="dir-detail-avatar">{getName(user).charAt(0)}</div>
          }
        </div>

        {/* name and category */}
        <h2 className="dir-detail-name">{getName(user)}</h2>
        <p className="dir-detail-category">{getCategory(user)}</p>

        {/* details */}
        <div className="dir-detail-info">
          {user.location_of_business && (
            <p>📍 {user.location}</p>
          )}
          {user.county && (
            <p>🗺 {user.county}</p>
          )}
          {user.phone_number && (
            <p>📞 {user.phone_number}</p>
          )}
          {user.description && (
            <p className="dir-detail-desc">{user.description}</p>
          )}
        </div>

        {/* message section */}
        <div className="dir-message-section">
          <textarea
            placeholder={`Send a message to ${getName(user)}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="dir-message-input"
          />
          {sent && <p className="dir-sent">Message sent!</p>}
          <button
            className="dir-send-btn"
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Message"}
          </button>
        </div>

      </div>
    </div>
  );
}