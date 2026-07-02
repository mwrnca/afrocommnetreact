import { useState, useEffect } from "react";
import { getUser } from "../../../api";
import "./ConsumerComponents.css";
import AvatarImage from "../../../components/HomeComponents/AvatarImage";

const BASE = "http://localhost:8000";

export default function ProfileAppearance() {
  const { id, role } = getUser();

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // fetch this user's own merged directory-style profile
  useEffect(() => {
    if (!id) return;

    fetch(`${BASE}/directory/full?role=${role}`)
      .then(res => res.json())
      .then(data => {
        const mine = data.find(entry => entry.id === id);
        if (mine) {
          setProfile(mine);
          setForm(mine);
        }
      });
  }, [id, role]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);

    // pick the right endpoint based on role
    let endpoint = null;
    let body = {};

    if (role === "business" || role === "management") {
      endpoint = `${BASE}/profiles/business/${id}`;
      body = {
        name_of_business:     form.name,
        nature_of_business:   form.category,
        location_of_business: form.location,
        county:                form.county,
        description:           form.description,
      };
    } else if (role === "institution") {
      endpoint = `${BASE}/profiles/institution/${id}`;
      body = {
        name_of_institution: form.name,
        type_of_institution: form.category,
        location:            form.location,
        county:               form.county,
        description:          form.description,
      };
    } else if (role === "professional") {
      endpoint = `${BASE}/profiles/professional/${id}`;
      body = {
        profession:     form.category,
        specialization: form.specialization || "",
        location:       form.location,
        county:          form.county,
        description:     form.description,
      };
    } else if (role === "consumer") {
      endpoint = `${BASE}/user/consumer/${id}`;
      body = {
        // profession:     form.category,
        // specialization: form.specialization || "",
        // location:       form.location,
        // county:          form.county,
        // description:     form.description,
        first_name:       form.first_name,
        second_name:      form.second_name,
        email:            form.email
      };
    }

    if (endpoint) {
      await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setSaving(false);
    setEditing(false);
    setProfile(form);
    setMsg("Profile updated");
    setTimeout(() => setMsg(""), 2500);
  };

  if (!profile) return <p className="profile-loading">Loading profile...</p>;

  const displayName = profile.name || `${profile.first_name} ${profile.second_name}`;

  return (
    <section className="profile-appearance-cont">
      <span>This is how people view your profile.</span>

      <section className="profile-appearance">
        <div className="profile-header">
          <div className="profile-header-info">
            <div className="dir-detail-image">
              {/* <div className="dir-detail-avatar">{displayName.charAt(0)}</div> */}
              <AvatarImage src={profile.profile_image} name={displayName} size={64} onClick={imageChange} />
            </div>

            <div className="profile-header-info">
              {editing ? (
                <>
                  <input
                    name="name"
                    placeholder="Business / Display Name"
                    value={form.name || ""}
                    onChange={handleChange}
                  />
                  <input
                    name="category"
                    placeholder="Category / Nature of Business"
                    value={form.category || ""}
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <span className="profile-title">{displayName}</span>
                  <small className="category">{profile.category || role}</small>
                </>
              )}
            </div>
          </div>

          <div>
            <button className="profile-contact-btn">CONTACT</button>
          </div>
        </div>

        <div className="profile-body">
          <div className="location-info">
            {editing ? (
              <>
                <input
                  name="location"
                  placeholder="Location"
                  value={form.location || ""}
                  onChange={handleChange}
                />
                <input
                  name="county"
                  placeholder="County"
                  value={form.county || ""}
                  onChange={handleChange}
                />
              </>
            ) : (
              <>
                {profile.location && <p>📍 {profile.location}</p>}
                {profile.county   && <p>🗺 {profile.county}</p>}
              </>
            )}
          </div>

          <div className="description">
            {editing ? (
              <textarea
                name="description"
                placeholder="Description shown to consumers"
                value={form.description || ""}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.description || "No description set yet."}</p>
            )}
          </div>
          <div className="profile-image-change">
            
          </div>
          <button onClick={imageChange}>
            CHANGE PROFILE IMAGE
          </button>
          {editing && <ProfileImageUpload />}

          {msg && <p className="msg-success">{msg}</p>}

          <div className="edit-buttons">
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "SAVE"}
                </button>
                <button onClick={() => { setEditing(false); setForm(profile); }}>
                  CANCEL
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}>EDIT</button>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}