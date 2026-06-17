import { useState, useEffect } from "react";
import CommunityCard from "../../components/HomeComponents/CommunitiesCard";
import { getUser } from "../../api";
import "./Dash.css";

const BASE = "http://localhost:8000";

const categories = [
  "All", "Finance", "Technology", "Marketing",
  "Health", "Education", "Agriculture", "Retail", "Other"
];

const compatibleRoles = {
  consumer:     ["consumer"],
  business:     ["business", "consumer"],
  professional: ["professional", "consumer"],
  institution:  ["institution", "consumer"],
};

export default function ConsCommunities() {
  const { id, role } = getUser();

  const [communities,   setCommunities]   = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [view,          setView]          = useState("mine");
  const [category,      setCategory]      = useState("All");
  const [showForm,      setShowForm]      = useState(false);
  const [form,          setForm]          = useState({
    name: "", description: "", category: "",
    is_private: false, password: "",
  });
  const [error, setError] = useState("");

  // fetch communities + my communities on mount
  useEffect(() => {
    if (!id) return;

    const rolesToFetch = compatibleRoles[role] || [role];

    Promise.all(
      rolesToFetch.map(r => fetch(`${BASE}/communities?role=${r}`).then(res => res.json()))
    ).then(results => {
      const merged = results.flat();
      setCommunities(merged);
    });

    fetch(`${BASE}/communities/user/${id}`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMyCommunities(data); });
  }, [id, role]);

  // build the set of joined ids — recalculated whenever myCommunities changes
  const joinedIds = new Set(myCommunities.map(c => c.id));

  const filtered = communities.filter(c =>
    category === "All" || c.category === category
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.category.trim()) {
      setError("All fields are required");
      return;
    }
    if (form.is_private && !form.password.trim()) {
      setError("Set a password for the private community");
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
    setForm({ name: "", description: "", category: "", is_private: false, password: "" });
    setShowForm(false);
  };

  const handleJoin = (communityId) => {
    setCommunities(prev =>
      prev.map(c => c.id === communityId ? { ...c, members: c.members + 1 } : c)
    );
    const joined = communities.find(c => c.id === communityId);
    if (joined) setMyCommunities(prev => [...prev, joined]);
  };

  const displayList = view === "mine" ? myCommunities : filtered;

  return (
    <div className="bss-page-container">

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

          <label>
            <input
              type="checkbox"
              name="is_private"
              checked={form.is_private}
              onChange={handleChange}
            />
            Make this community private
          </label>

          {form.is_private && (
            <input
              type="password"
              name="password"
              placeholder="Set community password"
              value={form.password}
              onChange={handleChange}
            />
          )}

          {error && <p className="msg-error">{error}</p>}
          <button onClick={handleCreate}>Create</button>
        </div>
      )}

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