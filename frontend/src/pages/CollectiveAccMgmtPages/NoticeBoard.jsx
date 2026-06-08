import { useState, useEffect } from "react";
import "./Dash.css";

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const employee = JSON.parse(localStorage.getItem("employee") || "{}");

  useEffect(() => {
    fetch(`http://localhost:8000/notice-board/${employee.businessId}`)
      .then(res => res.json())
      .then(data => { setNotices(data); setLoading(false); });
  }, []);

  const fmtDate = (ts) =>
    new Date(ts).toLocaleString("en-KE", {
      day: "numeric", month: "short",
      year: "numeric", hour: "2-digit", minute: "2-digit"
    });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="notice-board">
      <h2 className="section-title">Notice Board</h2>

      {notices.length === 0 ? (
        <p className="empty-msg">No notices yet</p>
      ) : (
        <div className="notices-list">
          {notices.map(notice => (
            <div key={notice.id} className="notice-card">
              <div className="notice-top">
                <h3 className="notice-title">{notice.title}</h3>
                <span className="notice-date">{fmtDate(notice.timestamp)}</span>
              </div>
              <p className="notice-posted">Posted by {notice.postedBy}</p>
              <p className="notice-body">{notice.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}