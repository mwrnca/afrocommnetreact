import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dash.css";

export default function DashEmplMgmt() {
  const navigate   = useNavigate();
  const user       = JSON.parse(localStorage.getItem("user") || "{}");
  const [employees, setEmployees] = useState([]);
  const [logs,      setLogs]      = useState([]);
  const [tasks,     setTasks]     = useState([]);
  const [notices,   setNotices]   = useState([]);
  const [loading,   setLoading]   = useState(true);

  // form states
  const [showEmpForm,    setShowEmpForm]    = useState(false);
  const [showTaskForm,   setShowTaskForm]   = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);

  const [empForm, setEmpForm] = useState({
    first_name: "", last_name: "", email: "",
    password: "", position: "",
  });
  const [taskForm, setTaskForm] = useState({
    employeeId: "", title: "", description: "",
    priority: "medium", dueDate: "",
  });
  const [noticeForm, setNoticeForm] = useState({
    title: "", body: "",
  });

  // fetch all data
  const fetchAll = () => {
    Promise.all([
      fetch(`http://localhost:8000/employees/${user.id}`).then(r => r.json()),
      fetch(`http://localhost:8000/logs/business/${user.id}`).then(r => r.json()),
      fetch(`http://localhost:8000/assigned-tasks/${user.id}`).then(r => r.json()),
      fetch(`http://localhost:8000/notice-board/${user.id}`).then(r => r.json()),
    ]).then(([emps, logs, tasks, notices]) => {
      setEmployees(emps);
      setLogs(logs);
      setTasks(tasks);
      setNotices(notices);
      setLoading(false);
    });
  };

  // fetch on mount then every 30 seconds
  useEffect(() => {
    if (!user.id) { navigate("/login/bss"); return; }
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleEmpChange    = (e) => setEmpForm(prev    => ({ ...prev, [e.target.name]: e.target.value }));
  const handleTaskChange   = (e) => setTaskForm(prev   => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNoticeChange = (e) => setNoticeForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // create employee
  const handleCreateEmp = async () => {
    if (!empForm.first_name || !empForm.email || !empForm.password) return;
    await fetch(`http://localhost:8000/employees/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empForm),
    });
    setEmpForm({ first_name: "", last_name: "", email: "", password: "", position: "" });
    setShowEmpForm(false);
    fetchAll();
  };

  // assign task
  const handleAssignTask = async () => {
    if (!taskForm.title || !taskForm.employeeId) return;
    await fetch(`http://localhost:8000/assigned-tasks/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...taskForm, employeeId: parseInt(taskForm.employeeId) }),
    });
    setTaskForm({ employeeId: "", title: "", description: "", priority: "medium", dueDate: "" });
    setShowTaskForm(false);
    fetchAll();
  };

  // post notice
  const handlePostNotice = async () => {
    if (!noticeForm.title || !noticeForm.body) return;
    await fetch(`http://localhost:8000/notice-board/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...noticeForm,
        postedBy: `${user.first_name} ${user.second_name}`,
      }),
    });
    setNoticeForm({ title: "", body: "" });
    setShowNoticeForm(false);
    fetchAll();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mgmt-page">

      {/* ── Stats row ── */}
      <div className="mgmt-stats">
        <div className="mgmt-stat-card">
          <p>Total Employees</p>
          <h2>{employees.length}</h2>
        </div>
        <div className="mgmt-stat-card">
          <p>Total Logs Today</p>
          <h2>{logs.filter(l => l.date === new Date().toISOString().split("T")[0]).length}</h2>
        </div>
        <div className="mgmt-stat-card">
          <p>Tasks Completed</p>
          <h2>{tasks.filter(t => t.completed).length} / {tasks.length}</h2>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="mgmt-actions">
        <button className="mgmt-btn" onClick={() => setShowEmpForm(p => !p)}>
          {showEmpForm ? "Cancel" : "+ Add Employee"}
        </button>
        <button className="mgmt-btn" onClick={() => setShowTaskForm(p => !p)}>
          {showTaskForm ? "Cancel" : "+ Assign Task"}
        </button>
        <button className="mgmt-btn" onClick={() => setShowNoticeForm(p => !p)}>
          {showNoticeForm ? "Cancel" : "+ Post Notice"}
        </button>
      </div>

      {/* ── Add Employee form ── */}
      {showEmpForm && (
        <div className="task-form">
          <input name="first_name" placeholder="First Name"  value={empForm.first_name} onChange={handleEmpChange} />
          <input name="last_name"  placeholder="Last Name"   value={empForm.last_name}  onChange={handleEmpChange} />
          <input name="email"      placeholder="Email"       value={empForm.email}      onChange={handleEmpChange} />
          <input name="password"   placeholder="Password"    value={empForm.password}   onChange={handleEmpChange} type="password" />
          <input name="position"   placeholder="Position e.g. Sales Rep" value={empForm.position} onChange={handleEmpChange} />
          <button onClick={handleCreateEmp}>Create Employee</button>
        </div>
      )}

      {/* ── Assign Task form ── */}
      {showTaskForm && (
        <div className="task-form">
          <select name="employeeId" value={taskForm.employeeId} onChange={handleTaskChange}>
            <option value="">Select Employee</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.first_name} {e.last_name} — {e.position}
              </option>
            ))}
          </select>
          <input name="title"       placeholder="Task title"       value={taskForm.title}       onChange={handleTaskChange} />
          <textarea name="description" placeholder="Description"   value={taskForm.description} onChange={handleTaskChange} />
          <select name="priority" value={taskForm.priority} onChange={handleTaskChange}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input name="dueDate" type="date" value={taskForm.dueDate} onChange={handleTaskChange} />
          <button onClick={handleAssignTask}>Assign Task</button>
        </div>
      )}

      {/* ── Post Notice form ── */}
      {showNoticeForm && (
        <div className="task-form">
          <input    name="title" placeholder="Notice title" value={noticeForm.title} onChange={handleNoticeChange} />
          <textarea name="body"  placeholder="Notice body"  value={noticeForm.body}  onChange={handleNoticeChange} />
          <button onClick={handlePostNotice}>Post Notice</button>
        </div>
      )}

      {/* ── Employees list ── */}
      <div className="mgmt-section">
        <h3 className="mgmt-section-title">Employees</h3>
        <div className="mgmt-list">
          {employees.map(emp => (
            <div key={emp.id} className="mgmt-emp-card">
              <div className="mgmt-emp-avatar">{emp.first_name.charAt(0)}</div>
              <div>
                <p className="mgmt-emp-name">{emp.first_name} {emp.last_name}</p>
                <p className="mgmt-emp-pos">{emp.position || "No position set"}</p>
                <p className="mgmt-emp-email">{emp.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent logs ── */}
      <div className="mgmt-section">
        <h3 className="mgmt-section-title">Recent Activity</h3>
        <div className="mgmt-list">
          {logs.slice(0, 10).map(log => {
            const emp = employees.find(e => e.id === log.employeeId);
            return (
              <div key={log.id} className="mgmt-log-card">
                <div className="mgmt-log-top">
                  <span className="mgmt-log-type">{log.entry_type}</span>
                  <span className="mgmt-log-time">
                    {new Date(log.timestamp).toLocaleString("en-KE", {
                      day: "numeric", month: "short",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
                <p className="mgmt-log-title">{log.title}</p>
                {log.amount && <p className="mgmt-log-amount">KES {log.amount.toLocaleString()}</p>}
                <p className="mgmt-log-emp">
                  By {emp ? `${emp.first_name} ${emp.last_name}` : "Unknown"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}