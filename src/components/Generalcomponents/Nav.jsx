import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Generalcomponents.css"
import Footer from "../Footer";

export default function NavBar({ open, setOpen, currentPage }) {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = dateTime.toLocaleString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <nav className={`navbar ${open ? "navbar-open" : ""}`}>
      <div className="navbar-logo">
        <h1>Cyberease</h1>
      </div>

      <div className="navbar-links">
        <NavLink to="/dash/bss" onClick={() => setOpen(false)}><span className="nav-link-text">Home</span></NavLink>
        <NavLink to="/dash/todo" onClick={() => setOpen(false)}><span className="nav-link-text">To-Do</span></NavLink>
        <NavLink to="/dash/tools" onClick={() => setOpen(false)}><span className="nav-link-text">Tools</span></NavLink>
        <NavLink to="/dash/inbox" onClick={() => setOpen(false)}><span className="nav-link-text">Inbox</span></NavLink>
        <NavLink to="/dash/communities" onClick={() => setOpen(false)}><span className="nav-link-text">Communities</span></NavLink>
        <NavLink to="/dash/settings" onClick={() => setOpen(false)}><span className="nav-link-text">Settings</span></NavLink>
      </div>

      {/* date shown at bottom of navbar on mobile only */}
      <div className="navbar-date mobile-only">{formatted}</div>

      <div>
        <Footer />
      </div>
    </nav>
  );
}