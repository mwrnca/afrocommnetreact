import { useState } from "react";
import { getUser } from "../../api";
import CommunityRoom from "./CommunityRoom";
import "./Homecomponents.css";

const BASE = "http://localhost:8000";

export default function CommunityCard({ community, onJoin, isJoined }) {
  const [expanded, setExpanded] = useState(false);
  const [joined,   setJoined]   = useState(isJoined || false);
  const [inRoom,   setInRoom]   = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [joinPassword, setJoinPassword] = useState("");
  const [joinError, setJoinError] = useState("");

  const handleJoin = async (e) => {
    e.stopPropagation();
    const { id } = getUser();
    if (!id) return;

    // if private and password not yet entered, show the prompt and stop here
    if (community.is_private && !showPasswordPrompt) {
      setShowPasswordPrompt(true);
      return;
    }

    const url = community.is_private
      ? `${BASE}/communities/${community.id}/join/${id}?password=${joinPassword}`
      : `${BASE}/communities/${community.id}/join/${id}`;

    const res = await fetch(url, { method: "POST" });

    if (!res.ok) {
      const err = await res.json();
      setJoinError(err.detail || "Failed to join");
      return;
    }

    setJoined(true);
    setShowPasswordPrompt(false);
    setJoinError("");
    onJoin(community.id);
  };

  if (inRoom) {
    return (
      <CommunityRoom
        community={community}
        onBack={() => setInRoom(false)}
      />
    );
  }

  return (
    <div
      className={`community-card ${expanded ? "community-expanded" : ""}`}
      onClick={() => {
        if (joined) { setInRoom(true); return; }
        setExpanded(prev => !prev);
      }}
    >
      <div className="community-top">
        <div className="community-info">
          <span className="community-tag">{community.category}</span>
          <h3 className="community-name">
            {community.name} {community.is_private && "🔒"}
          </h3>
          <p className="community-members">👥 {community.members} members</p>
        </div>

        <div className="community-top-right">
          {joined && <span className="community-joined-badge">✓ Joined</span>}
          <span className={`community-arrow ${expanded ? "arrow-up" : ""}`}>›</span>
        </div>
      </div>

      {expanded && !joined && (
        <div className="community-details" onClick={e => e.stopPropagation()}>
          <p className="community-desc">{community.description}</p>

          {!showPasswordPrompt ? (
            <button className="community-join-btn" onClick={handleJoin}>
              Join Community
            </button>
          ) : (
            <div className="community-password-prompt">
              <input
                type="password"
                placeholder="Enter community password"
                value={joinPassword}
                onChange={(e) => setJoinPassword(e.target.value)}
              />
              {joinError && <p className="msg-error">{joinError}</p>}
              <button onClick={handleJoin}>Confirm Join</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}