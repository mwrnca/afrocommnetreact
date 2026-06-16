import { useState, useEffect } from "react";
import CommunityCard from "../../components/HomeComponents/CommunitiesCard";
import { getUser } from "../../api";
import "./Dash.css";

const BASE = "http://localhost:8000";

const categories = [
  "All", "Finance", "Technology", "Marketing",
  "Health", "Education", "Agriculture", "Retail", "Other"
];

export default function ConsCommunities() {
  const [communities,   setCommunities]   = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [view,          setView]          = useState("all"); // "all" or "mine"
  const [category,      setCategory]      = useState("All");
  const [showForm,      setShowForm]      = useState(false);
  const [form,          setForm]          = useState({ name: "", description: "", category: "" });
  const [error,         setError]         = useState("");

  const { id, role } = getUser();

  useEffect(() => {
    if (!id) return;

    // fetch all communities for this role
    fetch(`${BASE}/communities?role=${role}`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCommunities(data); });

    // fetch communities this user has joined
    fetch(`${BASE}/communities/user/${id}`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMyCommunities(data); });
  }, [id, role]);

  const joinedIds = new Set(myCommunities.map(c => c.id));

  // filter by category
  const filtered = communities.filter(c =>
    category === "All" || c.category === category
  );

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.category.trim()) {
      setError("All fields are required");
      return;
    }

    setError("");

    const res = await fetch(`${BASE}/communities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, members: 1, role }),
    });

    const saved = await res.json();
    setCommunities(prev => [...prev, saved]);
    setMyCommunities(prev => [...prev, saved]);
    setForm({ name: "", description: "", category: "" });
    setShowForm(false);
  };

  const handleJoin = (communityId) => {
    // update member count
    setCommunities(prev =>
      prev.map(c => c.id === communityId ? { ...c, members: c.members + 1 } : c)
    );
    // add to my communities
    const joined = communities.find(c => c.id === communityId);
    if (joined) setMyCommunities(prev => [...prev, joined]);
  };

  const displayList = view === "mine" ? myCommunities : filtered;

  return (
    <div className="bss-page-container">

      {/* header */}
      <div className="communities-header">
        <h2 className="communities-title">Communities</h2>
        <div className="communities-btns">
          <button
            className="communities-create-btn"
            onClick={() => { setView("mine"); setShowForm(false); }}
          >
            My Communities
          </button>
          <button
            className="communities-create-btn"
            onClick={() => { setView("all"); setShowForm(false); }}
          >
            Browse
          </button>
          <button
            className="communities-create-btn"
            onClick={() => setShowForm(prev => !prev)}
          >
            {showForm ? "Cancel" : "+ Create"}
          </button>
        </div>
      </div>

      {/* category filter — only show when browsing */}
      {view === "all" && (
        <div className="communities-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`community-cat-btn ${category === cat ? "cat-active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* create form */}
      {showForm && (
        <div className="task-form">
          <input
            name="name"
            placeholder="Community name"
            value={form.name}
            onChange={handleChange}
          />
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select category</option>
            {categories.filter(c => c !== "All").map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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

      {/* list */}
      <div className="communities-list">
        {displayList.length === 0 ? (
          <p className="inbox-empty">
            {view === "mine" ? "You haven't joined any communities yet" : "No communities found"}
          </p>
        ) : (
          displayList.map(community => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoin={handleJoin}
              isJoined={joinedIds.has(community.id)}
            />
          ))
        )}
      </div>

    </div>
  );
}