import { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import NavBar from "./Nav";
import TopBar from "./TopBar";
import "./Generalcomponents.css";

const pageNames = {
  // business
  "/dash/bss":              "Home",
  "/dash/bss/todo":         "To-Do",
  "/dash/bss/inbox":        "Inbox",
  "/dash/bss/tools":        "Tools",
  "/dash/bss/communities":  "Communities",
  "/dash/bss/settings":     "Settings",

  // consumer
  "/dash/cons":             "Home",
  "/dash/cons/todo":        "To-Do",
  "/dash/cons/inbox":       "Inbox",
  "/dash/cons/tools":       "Tools",
  "/dash/cons/communities": "Communities",
  "/dash/cons/settings":    "Settings",

  // professional
  "/dash/prof":             "Home",
  "/dash/prof/todo":        "To-Do",
  "/dash/prof/inbox":       "Inbox",
  "/dash/prof/tools":       "Tools",
  "/dash/prof/communities": "Communities",
  "/dash/prof/settings":    "Settings",

  // institution
  "/dash/inst":             "Home",
  "/dash/inst/todo":        "To-Do",
  "/dash/inst/inbox":       "Inbox",  
  "/dash/inst/tools":       "Tools",
  "/dash/inst/communities": "Communities",
  "/dash/inst/settings":    "Settings",

  // employee
  "/dash/employee":         "Home",
  "/dash/employee/tasks":   "Tasks",
  "/dash/employee/notice":  "Notice Board",
  "/dash/employee/inbox":   "Inbox",
  "/dash/employee/tools":   "Tools",

  // management
  "/dash/mgmt":         "Home",
  "/dash/mgmt/tasks":   "Tasks",
  "/dash/mgmt/notice":  "Notice Board",
  "/dash/mgmt/inbox":   "Inbox",
  "/dash/mgmt/tools":   "Tools",
};

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentPage = pageNames[location.pathname] || "Home";

  return (
    <div className="layout">
      {open && (
        <div className="overlay" onClick={() => setOpen(false)} />
      )}

      <NavBar open={open} setOpen={setOpen} currentPage={currentPage} />

      <div className="main-area">
        <TopBar open={open} setOpen={setOpen} currentPage={currentPage} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}