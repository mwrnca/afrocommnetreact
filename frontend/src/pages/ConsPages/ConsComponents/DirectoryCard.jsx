import { useState } from "react";
import DirectoryDetail from "./DirectoryDetail";
import "./ConsumerComponents.css";

// shows the right label based on role
const roleLabel = {
  business:     "Business",
  professional: "Professional",
  institution:  "Institution",
};

// shows the right name — business has a business name, others use first + second
const getName = (user) =>
  user.name_of_business || `${user.first_name} ${user.second_name}`;

// shows the right category — business has nature, others use role label
const getCategory = (user) =>
  user.nature_of_business || roleLabel[user.role] || user.role;

export default function DirectoryCard({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* card — clicking opens detail overlay */}
      <div className="dir-card" onClick={() => setOpen(true)}>

        {/* top half — image/logo */}
        <div className="dir-card-image">
          {user.profile_image
            ? <img src={user.profile_image} alt={getName(user)} />
            : <div className="dir-card-avatar">{getName(user).charAt(0)}</div>
          }
        </div>

        {/* bottom half — info */}
        <div className="dir-card-info">
          <p className="dir-card-name">{getName(user)}</p>
          <p className="dir-card-location">
            📍 {user.location || "Location not set"}
          </p>
          <span className="dir-card-tag">{getCategory(user)}</span>
        </div>

      </div>

      {/* full screen detail — opens on tap */}
      {open && (
        <DirectoryDetail user={user} onClose={() => setOpen(false)} />
      )}
    </>
  );
}