import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Generalcomponents/Header';
import Footer from "../../components/Generalcomponents/Footer";
import { login, saveUser } from '../../api';
import "./pages.css";

export default function LoginProf() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ 
    email: "", 
    password: "" 
  });
  const roleRoutes = {
  business:     "bss",
  professional: "prof",
  institution:  "inst",
  consumer:     "cons",
  management:   "empl-mgmt",
  employee:      "employee",
  };

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const data = await login(form.email, form.password);
      saveUser(data.user);
      // route based on role returned from backend
      navigate(`/dash/${roleRoutes[data.user.role]}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page-container">
      <Header />
      <section className="signup-container">
        <h1 id="myH1" style={{ margin: '20px' }}>LOG IN</h1>
        <input name="email"    type="email"    placeholder="Email Address" value={form.email}    onChange={handleChange} />
        <input name="password" type="password" placeholder="Password"      value={form.password} onChange={handleChange} />
        {error && <p className="msg-error">{error}</p>}
        <button onClick={handleSubmit} className="btn-green" style={{ margin: '20px', width: '80%' }}>
          <span>LOG IN</span>
        </button>
      </section>
      <Footer />
    </section>
  );
}