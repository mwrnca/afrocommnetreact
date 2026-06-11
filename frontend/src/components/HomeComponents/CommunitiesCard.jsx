import { useState } from "react";
import { getUser } from "../../api";
import "./Homecomponents.css";

const BASE = "http://localhost:8000";

export default function CommunityCard({ community, onJoin }) {
  const [expanded, setExpanded] = useState(false);
  const [joined,   setJoined]   = useState(false);

  const handleJoin = async (e) => {
    e.stopPropagation();
    const { id } = getUser();
    if (!id) return;

    await fetch(`${BASE}/communities/${community.id}/join/${id}`, {
      method: "POST",
    });

    setJoined(true);
    onJoin(community.id);
  };

  return (
    <div
      className={`community-card ${expanded ? "community-expanded" : ""}`}
      onClick={() => setExpanded(prev => !prev)}
    >
      {/* top row — always visible */}
      <div className="community-top">
        <div className="community-info">
          <span className="community-tag">{community.category}</span>
          <h3 className="community-name">{community.name}</h3>
          <p className="community-members">👥 {community.members} members</p>
        </div>

        <span className={`community-arrow ${expanded ? "arrow-up" : ""}`}>
          ›
        </span>
      </div>

      {/* expanded section */}
      {expanded && (
        <div className="community-details" onClick={e => e.stopPropagation()}>
          <p className="community-desc">{community.description}</p>

          <button
            className={`community-join-btn ${joined ? "joined" : ""}`}
            onClick={handleJoin}
            disabled={joined}
          >
            {joined ? "✓ Joined" : "Join Community"}
          </button>
        </div>
      )}
    </div>
  );
}