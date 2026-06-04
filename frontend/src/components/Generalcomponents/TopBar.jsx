import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import "./Generalcomponents.css"

export default function TopBar({ open, setOpen, currentPage }) {
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
    <header className="topbar">
      {/* large screen — current page */}
      <span className="topbar-page desktop-only">{currentPage}</span>

      {/* mobile — hamburger */}
      <button
        className="hamburger mobile-only"
        onClick={() => setOpen(prev => !prev)}
      >
        {open ? "✕" : "☰"}
      </button>

      {/* always visible */}
      <div className="topbar-search">
        <SearchBar />
      </div>

      {/* large screen — date time */}
      <span className="topbar-date desktop-only">{formatted}</span>
    </header>
  );
}