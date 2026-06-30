// DirectoryDetail.jsx — fixed, no more broken `role.location` reference
import { useState } from "react";
import "./ConsumerComponents.css";

export default function DirectoryDetail({ user, onClose }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);

  const loggedIn = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user.name || `${user.first_name} ${user.second_name}`;

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);

    await fetch(`http://localhost:8000/messages/${loggedIn.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId:     loggedIn.id,
        receiverId:   user.id,
        receiverName: displayName,
        senderName:   `${loggedIn.first_name} ${loggedIn.second_name}`,
        subject:      `Message from ${loggedIn.first_name}`,
        body:         message,
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
        <button className="dir-close" onClick={onClose}>✕</button>

      <section className="dir-header-cont">
        <div className="dir-header-major">
          <div className="dir-detail-image">
            <div className="dir-detail-avatar">{displayName.charAt(0)}</div>
          </div>

          <div>
            <h2 className="dir-detail-name">{displayName}</h2>
            <p className="dir-detail-category">{user.category || user.role}</p>
          </div>
          
        </div>

        <div className="contact-btn" onClick={() => setOpen(true)}>
            CONTACT
        </div>
      </section>

        <div className="dir-detail-info">
          {user.location && <p>📍 {user.location}</p>}
          {user.county   && <p>🗺 {user.county}</p>}
          {user.phone_number && <p>📞 {user.phone_number}</p>}
          {user.description && <p className="dir-detail-desc">{user.description}</p>}
        </div>

        <section className="contactact-container">
          {/* <div className="contact-btn" onClick={() => setOpen(true)}>
            CONTACT
          </div> */}

          {open && (
            <div className="dir-message-section">
              <textarea
                placeholder={`Send a message to ${displayName}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="dir-message-input"
              />
              {sent && <p className="dir-sent">Message sent!</p>}
              <button className="dir-send-btn" onClick={handleSend} disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}