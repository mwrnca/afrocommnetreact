import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../../api" 
import "./Generalcomponents.css";
import Footer from "./Footer";
import { FEATURES } from "../../featureFlags";

const allNavLinks = {
  business: [
    { label: "Home",        path: "/dash/bss",              flag: true }, // home always on
    { label: "To-Do",       path: "/dash/bss/todo",          flag: FEATURES.todo },
    { label: "Inbox",       path: "/dash/bss/inbox",         flag: FEATURES.inbox },
    { label: "Tools",       path: "/dash/bss/tools",         flag: FEATURES.tools },
    { label: "Communities", path: "/dash/bss/communities",   flag: FEATURES.communities },
    { label: "Settings",    path: "/dash/bss/settings",      flag: FEATURES.settings },
  ],
  consumer: [
    { label: "Home",        path: "/dash/cons",              flag: true },
    { label: "Inbox",       path: "/dash/cons/inbox",        flag: FEATURES.inbox },
    { label: "Communities", path: "/dash/cons/communities",  flag: FEATURES.communities },
    { label: "Directory",   path: "/dash/cons/directory",    flag: FEATURES.directory },
    { label: "Settings",    path: "/dash/cons/settings",     flag: FEATURES.settings },
  ],
  professional: [
    { label: "Home",        path: "/dash/prof",              flag: true },
    { label: "To-Do",       path: "/dash/prof/todo",         flag: FEATURES.todo },
    { label: "Inbox",       path: "/dash/prof/inbox",        flag: FEATURES.inbox },
    { label: "Tools",       path: "/dash/prof/tools",        flag: FEATURES.tools },
    { label: "Communities", path: "/dash/prof/communities",  flag: FEATURES.communities },
    { label: "Settings",    path: "/dash/prof/settings",     flag: FEATURES.settings },
  ],
  institution: [
    { label: "Home",        path: "/dash/inst",              flag: true },
    { label: "To-Do",       path: "/dash/inst/todo",         flag: FEATURES.todo },
    { label: "Inbox",       path: "/dash/inst/inbox",        flag: FEATURES.inbox },
    { label: "Communities", path: "/dash/inst/communities",  flag: FEATURES.communities },
    { label: "Settings",    path: "/dash/inst/settings",     flag: FEATURES.settings },
  ],
  employee: [
    { label: "Home",         path: "/dash/employee",         flag: true },
    { label: "Tasks",        path: "/dash/employee/tasks",   flag: FEATURES.employeeApp },
    { label: "Notice Board", path: "/dash/employee/notice",  flag: FEATURES.employeeApp },
    { label: "Inbox",        path: "/dash/employee/inbox",   flag: FEATURES.inbox },
    { label: "Tools",        path: "/dash/employee/tools",   flag: FEATURES.tools },
  ],
};

// filter out anything whose flag is false
const navLinks = Object.fromEntries(
  Object.entries(allNavLinks).map(([role, links]) => [
    role,
    links.filter(link => link.flag)
  ])
);

const getHomeRoute = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const routes = {
    business:     "/dash/bss",
    professional: "/dash/prof",
    institution:  "/dash/inst",
    consumer:     "/dash/cons",
    employee:     "/dash/employee",
    management:   "/dash/mgmt",
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