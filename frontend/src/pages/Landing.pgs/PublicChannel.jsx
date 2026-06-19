import { useState, useEffect } from "react";
import "./Pages.css";

const BASE = "http://localhost:8000";

export default function PublicChannel() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/public-posts`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPosts(data); });
  }, []);

  const fmtTime = (ts) =>
    new Date(ts).toLocaleDateString("en-KE", { day: "numeric", month: "short" });

  if (posts.length === 0) return null;

  return (
    <section className="public-channel">
      <h3 className="public-channel-title">From Our Community</h3>
      <div className="public-channel-list">
        {posts.map(post => (
          <div key={post.id} className="public-post-card">
            <div className="public-post-top">
              <span className="public-post-name">{post.senderName}</span>
              <span className="public-post-role">{post.role}</span>
            </div>
            <p className="public-post-body">{post.body}</p>
            <span className="public-post-time">{fmtTime(post.timestamp)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}