import { useState, useEffect, useCallback } from "react";
import { getUser } from "../../api";
import { useNavigate } from "react-router-dom";
import "./Homecomponents.css";

const BASE = "http://localhost:8000";

export default function DashHome({ rolePrefix }) {
  const navigate = useNavigate();
  const { id, role } = getUser();

  const [viewCount,      setViewCount]      = useState(0);
  const [profile,        setProfile]        = useState(null);
  const [unreadCount,    setUnreadCount]    = useState(0);
  const [recentMsgs,     setRecentMsgs]     = useState([]);
  const [communityNotif, setCommunityNotif] = useState(0);
  const [tasksDue,       setTasksDue]       = useState([]);
  const [loading,        setLoading]        = useState(true);

  // separate fetch for messages so we can poll it independently
  const fetchMessages = useCallback(() => {
    if (!id) return;
    fetch(`${BASE}/messages/${id}/received`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUnreadCount(data.filter(m => !m.read).length);
          setRecentMsgs(data.slice(0, 2));
        }
      }).catch(() => {});
  }, [id]);

  const fetchCommunityNotifs = useCallback(() => {
    if (!id) return;
    fetch(`${BASE}/notifications/communities/${id}`)
      .then(r => r.json())
      .then(data => setCommunityNotif(data.count || 0))
      .catch(() => {});
  }, [id]);

  // initial full load
  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch(`${BASE}/profile-views/${id}/count`).then(r => r.json()),
      fetch(`${BASE}/directory/full?role=${role}`).then(r => r.json()),
      fetch(`${BASE}/messages/${id}/received`).then(r => r.json()),
      fetch(`${BASE}/notifications/communities/${id}`).then(r => r.json()),
      fetch(`${BASE}/tasks/${id}`).then(r => r.json()),
    ]).then(([viewsData, dirData, msgsData, notifData, tasksData]) => {
      setViewCount(viewsData.count || 0);

      const mine = Array.isArray(dirData) ? dirData.find(e => e.id === id) : null;
      setProfile(mine || null);

      if (Array.isArray(msgsData)) {
        setUnreadCount(msgsData.filter(m => !m.read).length);
        setRecentMsgs(msgsData.slice(0, 2));
      }

      setCommunityNotif(notifData.count || 0);

      if (Array.isArray(tasksData)) {
        const soon = new Date(Date.now() + 48 * 60 * 60 * 1000);
        setTasksDue(tasksData.filter(t =>
          !t.completed && t.dueDate && new Date(t.dueDate) <= soon
        ));
      }
    }).finally(() => setLoading(false));
  }, [id, role]);

  // poll messages every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleMarkCommunitySeen = async () => {
    await fetch(`${BASE}/notifications/communities/${id}/seen`, { method: "POST" });
    setCommunityNotif(0);
  };

  const getCompleteness = () => {
    if (!profile) return 0;
    const fields = [profile.name, profile.category, profile.location, profile.county, profile.description];
    const filled = fields.filter(f => f && f.trim()).length;
    return Math.round((filled / fields.length) * 100);
  };

  const missingFields = () => {
    if (!profile) return [];
    const map = {
      name: "business name", category: "category",
      location: "location", county: "county", description: "description",
    };
    return Object.entries(map)
      .filter(([key]) => !profile[key] || !profile[key].trim())
      .map(([, label]) => label);
  };

  if (loading) return <p className="dash-loading">Loading dashboard...</p>;

  const completeness = getCompleteness();
  const missing      = missingFields();

  return (
    <div className="dash-home-summary">

      {/* ── stat row ── */}
      <div className="dash-stat-row">
        <div className="dash-stat-card">
          <p className="dash-stat-label">Profile Views</p>
          <h2 className="dash-stat-value">{viewCount}</h2>
        </div>

        <div className="dash-stat-card dash-stat-clickable"
          onClick={() => navigate(`/dash/${rolePrefix}/inbox`)}>
          <p className="dash-stat-label">New Messages</p>
          <h2 className="dash-stat-value">{unreadCount}</h2>
        </div>

        <div className="dash-stat-card">
          <p className="dash-stat-label">Community Activity</p>
          <h2 className="dash-stat-value">{communityNotif}</h2>
          {communityNotif > 0 && (
            <button className="dash-seen-btn" onClick={handleMarkCommunitySeen}>
              Mark all seen
            </button>
          )}
        </div>

        <div className="dash-stat-card dash-stat-clickable"
          onClick={() => navigate(`/dash/${rolePrefix}/todo`)}>
          <p className="dash-stat-label">Tasks Due Soon</p>
          <h2 className="dash-stat-value">{tasksDue.length}</h2>
        </div>
      </div>

      {/* ── profile completeness ── */}
      {completeness < 100 && (
        <div className="dash-completeness-card">
          <div className="dash-completeness-top">
            <p>Your profile is {completeness}% complete</p>
            <span>{completeness}%</span>
          </div>
          <div className="dash-progress-bar">
            <div className="dash-progress-fill" style={{ width: `${completeness}%` }} />
          </div>
          {missing.length > 0 && (
            <p className="dash-completeness-missing">Missing: {missing.join(", ")}</p>
          )}
          <button className="dash-complete-btn"
            onClick={() => navigate(`/dash/${rolePrefix}/settings`)}>
            Complete your profile →
          </button>
        </div>
      )}

      {/* ── two col ── */}
      <div className="dash-two-col">
        <div className="dash-mini-section">
          <h3 className="dash-mini-title">Recent Messages</h3>
          {recentMsgs.length === 0 ? (
            <p className="dash-mini-empty">No messages yet</p>
          ) : (
            recentMsgs.map(m => (
              <div key={m.id} className="dash-mini-item"
                onClick={() => navigate(`/dash/${rolePrefix}/inbox`)}>
                <p className="dash-mini-item-title">{m.senderName}</p>
                <p className="dash-mini-item-sub">{m.subject}</p>
              </div>
            ))
          )}
        </div>

        <div className="dash-mini-section">
          <h3 className="dash-mini-title">Tasks Due Soon</h3>
          {tasksDue.length === 0 ? (
            <p className="dash-mini-empty">Nothing urgent</p>
          ) : (
            tasksDue.map(t => (
              <div key={t.id} className="dash-mini-item"
                onClick={() => navigate(`/dash/${rolePrefix}/todo`)}>
                <p className="dash-mini-item-title">{t.title}</p>
                <p className="dash-mini-item-sub">Due {t.dueDate}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}