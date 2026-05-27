import { useState } from "react";
import "./Homecomponents.css";

export default function CommunityCard({ community, onJoin }) {
  const [expanded, setExpanded] = useState(false);

  const [joined, setJoined] = useState(false);

  const handleJoin = async (e) => {
    e.stopPropagation();

    await fetch(`http://localhost:3001/communities/${community.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ members: community.members + 1 }),
    });

    setJoined(true);

    onJoin(community.id);
  };

  return (
    <div
      className={`community-card ${expanded ? "community-expanded" : ""}`}
      onClick={() => setExpanded(prev => !prev)}
    >
      <div className="community-top">
        <div className="community-info">
          
          <span className="community-tag">{community.category}</span>

          <h3 className="community-name">{community.name}</h3>

          <p className="community-members">👥 {community.members} members</p>
        </div>

        <span className={`community-arrow ${expanded ? "arrow-up" : ""}`}>
        </span>
      </div>

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