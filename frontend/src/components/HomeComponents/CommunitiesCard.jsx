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

    await fetch(`${BASE}/communities/${community.id}/join/${id}`, {
      method: "POST",
    });

    setJoined(true);
    onJoin(community.id);
  }
};