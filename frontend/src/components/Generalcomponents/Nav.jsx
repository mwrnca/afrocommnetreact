import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../../api" 
import "./Generalcomponents.css";
import Footer from "./Footer";

const navLinks = {
  business: [
    { label: "Home",        path: "/dash/bss" },
    { label: "To-Do",       path: "/dash/bss/todo" },
    { label: "Inbox",       path: "/dash/bss/inbox" },
    { label: "Tools",       path: "/dash/bss/tools" },
    { label: "Communities", path: "/dash/bss/communities" },
    { label: "Settings",    path: "/dash/bss/settings" },
  ],
  consumer: [
    { label: "Home",        path: "/dash/cons" },
    { label: "To-Do",       path: "/dash/cons/todo" },
    { label: "Inbox",       path: "/dash/cons/inbox" },
    { label: "Tools",       path: "/dash/cons/tools" },
    { label: "Communities", path: "/dash/cons/communities" },
    { label: "Settings",    path: "/dash/cons/settings" },
  ],
  professional: [
    { label: "Home",        path: "/dash/prof" },
    { label: "To-Do",       path: "/dash/prof/todo" },
    { label: "Inbox",       path: "/dash/prof/inbox" },
    { label: "Tools",       path: "/dash/prof/tools" },
    { label: "Communities", path: "/dash/prof/communities" },
    { label: "Settings",    path: "/dash/prof/settings" },
  ],
  institution: [
    { label: "Home",        path: "/dash/inst" },
    { label: "To-Do",       path: "/dash/inst/todo" },
    { label: "Inbox",       path: "/dash/inst/inbox" },
    { label: "Tools",       path: "/dash/inst/tools" },
    { label: "Communities", path: "/dash/inst/communities" },
    { label: "Settings",    path: "/dash/inst/settings" },
  ],
  employee: [
    { label: "Home",         path: "/dash/employee" },
    { label: "Tasks",        path: "/dash/employee/tasks" },
    { label: "Notice Board", path: "/dash/employee/notice" },
    { label: "Inbox",        path: "/dash/employee/inbox" },
    { label: "Tools",        path: "/dash/employee/tools" },
  ],
};

const getHomeRoute = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const routes = {
    business:     "/dash/bss",
    professional: "/dash/prof",
    institution:  "/dash/inst",
    consumer:     "/dash/cons",
    employee:     "/dash/employee",
  };
  return routes[user.role] || "/";
};

export default function NavBar({ open, setOpen, currentPage }) {
  const [dateTime, setDateTime] = useState(new Date());
  const [user, setUser] = useState(() => getUser());
   const links = navLinks[user.role] || [];
  console.log("user:", user);
  console.log("role:", user.role);
  console.log("links:", links);
  console.log(localStorage.getItem("user"));

  // re-read localStorage whenever the component updates
  useEffect(() => {
  setUser(getUser());
}, [currentPage]); // re-reads when page changes

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
        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => setOpen(false)}
          >
            <span className="navbar-links-text">{link.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="navbar-date mobile-only">{formatted}</div>

      <div>
        <Footer />
      </div>
    </nav>
  );
}