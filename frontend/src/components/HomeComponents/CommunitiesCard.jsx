import { useState } from "react";
import { getUser } from "../../api";
import CommunityRoom from "./CommunityRoom";
import "./Homecomponents.css";

const BASE = "http://localhost:8000";

export default function CommunityCard({ community, onJoin, isJoined }) {
  const [expanded, setExpanded] = useState(false);
  const [joined,   setJoined]   = useState(isJoined || false);
  const [inRoom,   setInRoom]   = useState(false);

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

  // if in room show full screen room
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
        // if joined go straight to room
        if (joined) { setInRoom(true); return; }
        setExpanded(prev => !prev);
      }}
    >
      {/* top row */}
      <div className="community-top">
        <div className="community-info">
          <span className="community-tag">{community.category}</span>
          <h3 className="community-name">{community.name}</h3>
          <p className="community-members">👥 {community.members} members</p>
        </div>

        <div className="community-top-right">
          {joined && <span className="community-joined-badge">✓ Joined</span>}
          <span className={`community-arrow ${expanded ? "arrow-up" : ""}`}>›</span>
        </div>
      </div>

      {/* expanded — only shows if not joined */}
      {expanded && !joined && (
        <div className="community-details" onClick={e => e.stopPropagation()}>
          <p className="community-desc">{community.description}</p>
          <button className="community-join-btn" onClick={handleJoin}>
            Join Community
          </button>
        </div>
      )}
    </div>
  );
}