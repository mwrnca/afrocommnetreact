import { getUser, getBussiness } from "../../api";
import { useState } from "react";
import "./Homecomponents.css";

export default function ProfileDetail({ onClose }) {

  const { 
    first_name,
    second_name,
    email,
    phone_number,
 } = getUser();

 const {
    name_of_business,
    nature_of_business,
    location_of_business,
    county,
    description,
 } = getBussiness();

  const [formData, setFormData] = useState({
    first_name: "",
    second_name: "",
    email: "",
    phone_number: "",
  });

  const [profile, setProfile] = useState({
    name_of_business: "",
    nature_of_business: "",
    location_of_business: "",
    county: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfile = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProfile = {
      ...formData,
      ...profile,
    };

    console.log(updatedProfile);

    // API call here
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="profile-detail-card">
      <span className="profile-detail-header">
        EDIT PROFILE DETAILS
      </span>

      <div className="editing-container">
        <section className="new-info-container">
          <span>New Information</span>

          <form onSubmit={handleSubmit}>
            <input
              name="first_name"
              type="text"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
            />

            <input
              name="second_name"
              type="text"
              placeholder="Second Name"
              value={formData.second_name}
              onChange={handleChange}
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              name="phone_number"
              type="text"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
            />

            <input
              name="name_of_business"
              type="text"
              placeholder="Business Name"
              value={profile.name_of_business}
              onChange={handleProfile}
            />

            <input
              name="nature_of_business"
              type="text"
              placeholder="Nature of Business"
              value={profile.nature_of_business}
              onChange={handleProfile}
            />

            <input
              name="location_of_business"
              type="text"
              placeholder="Location"
              value={profile.location_of_business}
              onChange={handleProfile}
            />

            <input
              name="county"
              type="text"
              placeholder="County"
              value={profile.county}
              onChange={handleProfile}
            />

            <textarea
              name="description"
              placeholder="Short description of your business"
              value={profile.description}
              onChange={handleProfile}
            />

            <div className="button-group">
              <button type="submit">
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>

        <section className="signup-container">
          <span>Current Information</span>

          <p>{first_name}</p>
          <p>{second_name}</p>
          <p>{email}</p>
          <p>{phone_number}</p>
          <p>{name_of_business}</p>
          <p>{nature_of_business}</p>
          <p>{location_of_business}</p>
          <p>{county}</p>
          <p>{description}</p>
        </section>
      </div>
    </div>
  );
}