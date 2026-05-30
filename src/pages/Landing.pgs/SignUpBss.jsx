import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../../components/Generalcomponents/Header';
import "./pages.css";

export default function SignUpBss() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    first_name:           "",
    second_name:          "",
    email:                "",
    phone_number:         "",
    name_of_business:     "",
    nature_of_business:   "",
    location_of_business: "",
    county:               "",
    description:          "",
    password:             "",
    confirm_password:     "",
  });

  // updates whichever field changed
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    // validate all required fields are filled
    if (
      !form.first_name.trim()           ||
      !form.second_name.trim()          ||
      !form.email.trim()                ||
      !form.phone_number.trim()         ||
      !form.name_of_business.trim()     ||
      !form.nature_of_business.trim()   ||
      !form.location_of_business.trim() ||
      !form.county.trim()               ||
      !form.password.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    // check passwords match
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    // check email not already registered
    const check = await fetch(`http://localhost:3001/users?email=${form.email}`);
    const existing = await check.json();

    if (existing.length > 0) {
      setError("Email already registered");
      return;
    }

    // save to db.json — role hardcoded as business
    await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        role: "business",
      }),
    });

    navigate("/login/business");
  };

  return (
    <section className="page-container">
      <Header />

      <section className="roles">
        <h2>Create Account</h2>
        <p>We employ a Role-based registration system to ensure your account is tailored to your needs and preferences.</p><br />
        <p>By selecting the appropriate role during registration, you will gain access to features and functionalities that are relevant to your specific role,</p><br />
        <p>this will help in enhancing your overall experience on our platform.</p>
      </section>

      <section className="signup-container">
        <div>
          <h1 id="myH1" style={{ margin: '20px' }}>SIGN UP</h1>
        </div>

        <div>
          <input
            name="first_name"
            type="text"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
          />
          <input
            name="second_name"
            type="text"
            placeholder="Second Name"
            value={form.second_name}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="phone_number"
            type="text"
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={handleChange}
          />
          <input
            name="name_of_business"
            type="text"
            placeholder="Name of Business"
            value={form.name_of_business}
            onChange={handleChange}
          />
          <input
            name="nature_of_business"
            type="text"
            placeholder="Nature of Business e.g Restaurant, Salon"
            value={form.nature_of_business}
            onChange={handleChange}
          />
          <input
            name="location_of_business"
            type="text"
            placeholder="Location of Business"
            value={form.location_of_business}
            onChange={handleChange}
          />
          <input
            name="county"
            type="text"
            placeholder="County"
            value={form.county}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Short description of your business (consumers will see this)"
            value={form.description}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm Password"
            value={form.confirm_password}
            onChange={handleChange}
          />
        </div>

        {/* error message */}
        {error && <p className="msg-error">{error}</p>}

        <div
          onClick={handleSubmit}
          className="btn-green"
          style={{ margin: '20px', width: '80%' }}
        >
          <span onClick={() => navigate("./dash/cons")}>FINISH</span>
        </div>

      </section>

      <section className="roles">
        <h3 style={{ color: 'rgb(243, 238, 238)' }}>
          You have selected business operator as the nature of your account.
          If this is not intended click below to go back.
        </h3>
        <a onClick={() => navigate('/')} className="btn-green">HOME</a>
      </section>

      <footer className="hero">
        <p>© 2026 Afrocommnet™. All rights reserved.</p>
        <p>Afrocommnet, logo, and content are protected under copyright and trademark law.</p>
        <div className="footer-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </section>
  );
}