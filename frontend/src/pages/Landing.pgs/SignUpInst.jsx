import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Generalcomponents/Header';
import { signup, saveUser } from '../../api';
import "./pages.css";

export default function SignUpInst() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    first_name: "", 
    second_name: "", 
    email: "",
    phone_number: "", 
    password: "", 
    confirm_password: "",
  });

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.first_name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    try {
      const user = await signup({ ...form, role: "institution" });
      saveUser(user);
      navigate("/dash/inst");
    } catch (err) {
      setError(err.message);
    }
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
        <h1 id="myH1" style={{ margin: '20px' }}>SIGN UP</h1>
        <input name="first_name"   type="text"     placeholder="First Name"    value={form.first_name}   onChange={handleChange} />
        <input name="second_name"  type="text"     placeholder="Second Name"   value={form.second_name}  onChange={handleChange} />
        <input name="email"        type="email"    placeholder="Email Address" value={form.email}         onChange={handleChange} />
        <input name="phone_number" type="text"     placeholder="Phone Number"  value={form.phone_number} onChange={handleChange} />
        <input name="password"     type="password" placeholder="Password"      value={form.password}     onChange={handleChange} />
        <input name="confirm_password" type="password" placeholder="Confirm Password" value={form.confirm_password} onChange={handleChange} />
        {error && <p className="msg-error">{error}</p>}
        <button onClick={handleSubmit} className="btn-green" style={{ margin: '20px', width: '80%' }}>
          <span>FINISH</span>
        </button>
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