import { useState, useRef } from "react";
import { getUser, saveUser } from "../../api";
import AvatarImage from "./AvatarImage";

const BASE = "http://localhost:8000";
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export default function ProfileImageUpload() {
  const { id, first_name } = getUser();
  const stored = JSON.parse(localStorage.getItem("user") || "{}");

  const [preview,   setPreview]   = useState(stored.profile_image || null);
  const [uploading, setUploading] = useState(false);
  const [msg,       setMsg]       = useState("");
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      setMsg("Image too large — maximum 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result; // includes data:image/... prefix
      setUploading(true);

      const res = await fetch(`${BASE}/users/${id}/profile-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      setUploading(false);

      if (res.ok) {
        setPreview(base64);
        // update localStorage so avatar updates immediately everywhere
        saveUser({ ...getUser(), profile_image: base64 });
        setMsg("Photo updated");
      } else {
        setMsg("Upload failed");
      }
      setTimeout(() => setMsg(""), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = async () => {
    await fetch(`${BASE}/users/${id}/profile-image`, { method: "DELETE" });
    setPreview(null);
    saveUser({ ...getUser(), profile_image: null });
    setMsg("Photo removed");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="profile-img-upload">
      <AvatarImage src={preview} name={first_name} size={80} />

      <div className="profile-img-controls">
        <button
          className="profile-img-btn"
          onClick={() => inputRef.current.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>

        {preview && (
          <button className="profile-img-btn profile-img-remove" onClick={handleRemove}>
            Remove Photo
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />
      </div>

      {msg && <p className="profile-img-msg">{msg}</p>}
    </div>
  );
}