import { getUser, saveUser } from "../../api";
import { useState, useEffect } from "react";
import "./Homecomponents.css";

const BASE = "http://localhost:8000";

export default function ProfileDetail({ onClose }) {
  const { id, role } = getUser();

  const [current, setCurrent] = useState({});
  const [formData, setFormData] = useState({
    first_name: "", second_name: "", email: "", phone_number: "",
  });
  const [profile, setProfile] = useState({
    name_of_business: "", nature_of_business: "",
    location_of_business: "", county: "", description: "",
  });
  const [msg, setMsg] = useState("");

  // fetch current info on mount
  useEffect(() => {
    if (!id) return;

    fetch(`${BASE}/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setCurrent(data);
        setFormData({
          first_name:   data.first_name   || "",
          second_name:  data.second_name  || "",
          email:        data.email        || "",
          phone_number: data.phone_number || "",
        });
      });

    // only fetch business profile if role is business
    if (role === "business" || role === "management") {
      fetch(`${BASE}/profiles/business/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.name_of_business) setProfile(data);
        })
        .catch(() => {}); // profile might not exist yet
    }
  }, [id, role]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfile = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // update base user info
    await fetch(`${BASE}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    // update business profile if applicable
    if (role === "business" || role === "management") {
      await fetch(`${BASE}/profiles/business/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
    }

    // update localStorage so navbar/etc reflects new name immediately
    saveUser({ ...getUser(), ...formData });

    setMsg("Profile updated successfully");
    setTimeout(() => { setMsg(""); onClose(); }, 1500);
  };

  return (
    <div className="profile-detail-card">
      <span className="profile-detail-header">EDIT PROFILE DETAILS</span>

      <div className="editing-container">
        <section className="new-info-container">
          <span>New Information</span>
          <form onSubmit={handleSubmit}>
            <input name="first_name"   placeholder="First Name"   value={formData.first_name}   onChange={handleChange} />
            <input name="second_name"  placeholder="Second Name"  value={formData.second_name}  onChange={handleChange} />
            <input name="email"        placeholder="Email"        value={formData.email}        onChange={handleChange} />
            <input name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />

            {(role === "business" || role === "management") && (
              <>
                <input name="name_of_business"     placeholder="Business Name"     value={profile.name_of_business}     onChange={handleProfile} />
                <input name="nature_of_business"   placeholder="Nature of Business" value={profile.nature_of_business}   onChange={handleProfile} />
                <input name="location_of_business" placeholder="Location"           value={profile.location_of_business} onChange={handleProfile} />
                <input name="county"               placeholder="County"             value={profile.county}               onChange={handleProfile} />
                <textarea name="description" placeholder="Description" value={profile.description} onChange={handleProfile} />
              </>
            )}

            {msg && <p className="msg-success">{msg}</p>}

            <div className="button-group">
              <button type="submit" className="btn-green">Save Changes</button>
              <button type="button" onClick={onClose} className="btn-green">Cancel</button>
            </div>
          </form>
        </section>

        {/* <section className="current-info-container">
          <span>Current Information</span>
          <p>{current.first_name}</p>
          <p>{current.second_name}</p>
          <p>{current.email}</p>
          <p>{current.phone_number}</p>
          {profile.name_of_business && <p>{profile.name_of_business}</p>}
        </section> */}
      </div>
    </div>
  );
}