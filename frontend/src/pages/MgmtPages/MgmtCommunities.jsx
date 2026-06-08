import { useState, useEffect } from "react";
import CommunityCard from "../../components/HomeComponents/CommunitiesCard";
import "./Dash.css";

export default function MgmtCommunities() {
  const [communities, setCommunities] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({ name: "", description: "", category: "" });

  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/communities")
      .then(res => res.json())
      .then(data => setCommunities(data));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.category.trim()) {
      setError("All fields are required");
      return;
    }

    setError("");
    const res = await fetch("http://localhost:3001/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, members: 1 }),
    });

    const saved = await res.json();

    setCommunities(prev => [...prev, saved]);

    setForm({ name: "", description: "", category: "" });
    setShowForm(false);
  };

  const handleJoin = (id) => {
    setCommunities(prev =>
      prev.map(c => c.id === id ? { ...c, members: c.members + 1 } : c)
    );
  };

  return (
    <div className="communities-page">

      <div className="communities-header">
        <h2 className="communities-title">Communities</h2>

        <search className="communities-search">
          <input placeholder="Search communities..." />
        </search>
        
        <div className="communities-btns">
          <button
          className="communities-create-btn"
        >
          {showForm ? "Cancel" : "+ My Communities"}
        </button>
        <button
          className="communities-create-btn"
          onClick={() => setShowForm(prev => !prev)}
        >
          {showForm ? "Cancel" : "+ Create Community"}
        </button>
        </div>
        
      </div>

      {showForm && (
        <div className="task-form">
          <input
            name="name"
            placeholder="Community name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="category"
            placeholder="Category e.g. Finance, Tech, Marketing"
            value={form.category}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="What is this community about?"
            value={form.description}
            onChange={handleChange}
          />

          {error && <p className="msg-error">{error}</p>}

          <button onClick={handleCreate}>Create</button>
        </div>
      )}

      <div className="communities-list">
        {communities.length === 0
          ? <p className="inbox-empty">No communities yet</p>
          : communities.map(community => (
              <CommunityCard
                key={community.id}
                community={community}
                onJoin={handleJoin}
              />
            ))
        }
      </div>

    </div>
  );
}