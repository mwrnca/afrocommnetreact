import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Generalcomponents/Header';
import "./pages.css";

export default function LoginEmpl() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    const res = await fetch("http://localhost:8000/login/employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.detail || "Login failed");
      return;
    }

    const data = await res.json();

    // save employee to localStorage
    localStorage.setItem("employee", JSON.stringify(data.employee));
    localStorage.setItem("user", JSON.stringify({
      ...data.employee,
      role: "employee",
    }));

    navigate("/dash/employee");
  };

  return (
    <section className="page-container">
      <Header />
      <section className="signup-container">
        <h1 id="myH1" style={{ margin: '20px' }}>EMPLOYEE LOGIN</h1>
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {error && <p className="msg-error">{error}</p>}
        <button
          onClick={handleSubmit}
          className="btn-green"
          style={{ margin: '20px', width: '80%' }}
        >
          <span>LOG IN</span>
        </button>
      </section>
    </section>
  );
}