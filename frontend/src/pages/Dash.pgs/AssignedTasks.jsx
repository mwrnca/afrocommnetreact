import { useState, useEffect } from "react";
import "./Dash.css";

const priorityConfig = {
  high:   { color: "#e74c3c", icon: "▲" },
  medium: { color: "#e67e22", icon: "●" },
  low:    { color: "#27ae60", icon: "▼" },
};

export default function AssignedTasks() {
  const [tasks,    setTasks]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const employee = JSON.parse(localStorage.getItem("employee") || "{}");

  useEffect(() => {
    fetch(`http://localhost:8000/assigned-tasks/employee/${employee.id}`)
      .then(res => res.json())
      .then(data => { setTasks(data); setLoading(false); });
  }, []);

  const handleComplete = async (taskId) => {
    await fetch(`http://localhost:8000/assigned-tasks/${taskId}/complete`, {
      method: "PATCH",
    });
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, completed: true } : t)
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="assigned-tasks">
      <h2 className="section-title">Your Tasks</h2>

      {tasks.length === 0 ? (
        <p className="empty-msg">No tasks assigned yet</p>
      ) : (
        <div className="tasks-list">
          {tasks.map(task => {
            const p = priorityConfig[task.priority] || priorityConfig.medium;
            return (
              <div
                key={task.id}
                className={`assigned-task-card ${task.completed ? "task-done" : ""}`}
              >
                <div className="task-card-top">
                  <span style={{ color: p.color }}>{p.icon} {task.priority}</span>
                  {task.completed && <span className="task-complete-badge">✓ Done</span>}
                </div>

                <p className="task-card-title">{task.title}</p>

                {task.description && (
                  <p className="task-card-desc">{task.description}</p>
                )}

                {task.dueDate && (
                  <p className="task-card-date">📅 {task.dueDate}</p>
                )}

                {!task.completed && (
                  <button
                    className="task-complete-btn"
                    onClick={() => handleComplete(task.id)}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}