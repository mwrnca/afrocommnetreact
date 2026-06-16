import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Generalcomponents/Header';
import { signup, saveUser } from '../../api';
import "./pages.css";

const BASE = "http://localhost:8000";

export default function SignUpProf() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [step,  setStep]  = useState(1);

  const [form, setForm] = useState({
    first_name: "", second_name: "", email: "",
    phone_number: "", password: "", confirm_password: "",
  });

  const [profile, setProfile] = useState({
    profession: "", specialization: "",
    location: "", county: "", description: "",
  });

  const handleChange  = (e) => setForm(prev    => ({ ...prev, [e.target.name]: e.target.value }));
  const handleProfile = (e) => setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleStep1 = () => {
    if (!form.first_name.trim() || !form.email.trim() || !form.password.trim() || !form.phone_number.trim()) {
      setError("Please fill in all fields"); return;
    }
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match"); return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!profile.profession.trim() || !profile.location.trim() || !profile.county.trim()) {
      setError("Please fill in all required fields"); return;
    }
    try {
      const user = await signup({ ...form, role: "professional" });
      saveUser(user);

      await fetch(`${BASE}/profiles/professional/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      navigate("/dash/prof");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page-container">
      <Header />
      <section className="roles">
        <h2>Create Professional Account</h2>
        <p>Register as a professional to offer your services and connect with businesses and institutions.</p>
      </section>

      <section className="signup-container">
        <h1 id="myH1" style={{ margin: '20px' }}>SIGN UP — {step === 1 ? "Personal Info" : "Professional Info"}</h1>

        {step === 1 ? (
          <>
            <input name="first_name"       type="text"     placeholder="First Name"       value={form.first_name}       onChange={handleChange} />
            <input name="second_name"      type="text"     placeholder="Second Name"      value={form.second_name}      onChange={handleChange} />
            <input name="email"            type="email"    placeholder="Email Address"    value={form.email}            onChange={handleChange} />
            <input name="phone_number"     type="text"     placeholder="Phone Number"     value={form.phone_number}     onChange={handleChange} />
            <input name="password"         type="password" placeholder="Password"         value={form.password}         onChange={handleChange} />
            <input name="confirm_password" type="password" placeholder="Confirm Password" value={form.confirm_password} onChange={handleChange} />
            {error && <p className="msg-error">{error}</p>}
            <button onClick={handleStep1} className="btn-green" style={{ margin: '20px', width: '80%' }}>
              <span>NEXT →</span>
            </button>
          </>
        ) : (
          <>
            <input name="profession"     type="text" placeholder="Profession e.g. Lawyer, Doctor, Engineer" value={profile.profession}     onChange={handleProfile} />
            <input name="specialization" type="text" placeholder="Specialization (optional)"                value={profile.specialization} onChange={handleProfile} />
            <input name="location"       type="text" placeholder="Location"                                 value={profile.location}       onChange={handleProfile} />
            <input name="county"         type="text" placeholder="County"                                   value={profile.county}         onChange={handleProfile} />
            <textarea name="description" placeholder="Brief bio visible to potential clients" value={profile.description} onChange={handleProfile} />
            {error && <p className="msg-error">{error}</p>}
            <button onClick={() => setStep(1)} className="btn-green" style={{ margin: '10px 20px 0', width: '80%', background: '#333' }}>
              <span>← BACK</span>
            </button>
            <button onClick={handleSubmit} className="btn-green" style={{ margin: '10px 20px', width: '80%' }}>
              <span>FINISH</span>
            </button>
          </>
        )}
      </section>

      <footer className="hero">
        <p>© 2026 Afrocommnet™. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </section>
  );
}