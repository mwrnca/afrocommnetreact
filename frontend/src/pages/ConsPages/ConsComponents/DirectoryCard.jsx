// DirectoryCard.jsx — simplified since data is already merged
import { useState } from "react";
import DirectoryDetail from "./DirectoryDetail";
import AvatarImage from "../../../components/HomeComponents/AvatarImage";
import "./ConsumerComponents.css";

export default function DirectoryCard({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="dir-card" onClick={() => setOpen(true)}>
        <div className="dir-card-image">
          {/* <div className="dir-card-avatar">{(user.name || user.first_name).charAt(0)}</div> */}
          <AvatarImage  src={user.profile_image} name={user.name || user.first_name} size={80} />
        </div>
        <div className="dir-card-info">
          <p className="dir-card-name">{user.name || `${user.first_name} ${user.second_name}`}</p>
          <p className="dir-card-location">📍 {user.location || "Location not set"}</p>
          <span className="dir-card-tag">{user.category || user.role}</span>
        </div>
      </div>

      {open && <DirectoryDetail user={user} onClose={() => setOpen(false)} />}
    </>
  );
}