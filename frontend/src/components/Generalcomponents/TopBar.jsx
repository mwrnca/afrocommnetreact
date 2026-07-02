import { getUser } from "../../api";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import AvatarImage from "../HomeComponents/AvatarImage";
import "./Generalcomponents.css"

export default function TopBar({ open, setOpen, currentPage }) {

  const { first_name, email } = getUser();
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
      <div className="topbar-current-page desktop-only">
        <AvatarImage />
        <div>
          <h2>{ first_name || "name not available"}</h2>
          <small>{ email || "Email not available"}</small>
        </div>
      </div>

      {/* mobile — hamburger */}
      <button
        className="hamburger mobile-only"
        onClick={() => setOpen(prev => !prev)}
      >
        {open ? "✕" : "☰"}
      </button>
     
     {/* 
      always visible
      <div className="topbar-search">
        <SearchBar />
      </div> */}

      {/* large screen — date time */}
      <span className="topbar-date desktop-only">{formatted}</span>
    </header>
  );
}