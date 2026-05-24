import { useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./Nav";
import TopBar from "./TopBar";
import "./Generalcomponents.css"

const pageNames = {
  "/home": "Home",
  "/history": "History",
  "/profile": "Profile",
  "/services": "Services",
};

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentPage = pageNames[location.pathname] || "Home";

  return (
    <div className="layout">
      {/* overlay — closes menu when clicking outside */}
      {open && (
        <div className="overlay" onClick={() => setOpen(false)} />
      )}

      <NavBar open={open} setOpen={setOpen} currentPage={currentPage} />

      <div className="main-area">
        <TopBar open={open} setOpen={setOpen} currentPage={currentPage} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}