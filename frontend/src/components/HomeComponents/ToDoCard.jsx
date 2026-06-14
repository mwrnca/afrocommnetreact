import { useState } from "react";
import TaskDetail from "./TaskDetail";
import "./Homecomponents.css";

const priorityConfig = {
  high:   { label: "High",   color: "#e74c3c", bg: "#fdecea", icon: "▲" },
  medium: { label: "Medium", color: "#e67e22", bg: "#fef3e2", icon: "●" },
  low:    { label: "Low",    color: "#27ae60", bg: "#e9f7ef", icon: "▼" },
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-KE", {
    day: "numeric", month: "short", year: "numeric",
  });

const checkOverdue = (d) => new Date(d) < new Date() && d;

export default function ToDoCard({ task, onComplete }) {
  const [open,      setOpen]      = useState(false);
  const [completed, setCompleted] = useState(task.completed || false);

  const overdue = checkOverdue(task.dueDate);
  const p       = priorityConfig[task.priority] || priorityConfig.low;

  const handleComplete = async (e) => {
    // stop click from opening the detail modal
    e.stopPropagation();

    await fetch(`http://localhost:8000/tasks/${task.id}/complete`, {
      method: "PATCH",
    });

    setCompleted(true);

    // tell parent to remove this card from the list
    if (onComplete) onComplete(task.id);
  };

  if (completed) return null; // disappears after marked complete

  return (
    <>
      <div className="todo-card" onClick={() => setOpen(true)}>
        <div className="todo-card-header">
          <span className="to-do-priority" style={{ color: p.color }}>
            {p.icon} {p.label}
          </span>
          {overdue && <span className="todo-overdue">Overdue</span>}
        </div>

        <p className="todo-title">{task.title}</p>

        {task.dueDate && (
          <p className="todo-date" style={{ color: overdue ? "#e74c3c" : "#888" }}>
            {fmtDate(task.dueDate)}
          </p>
        )}

        {task.notes && <p className="todo-preview">{task.notes}</p>}

        {/* complete button */}
        <button
          className="todo-complete-btn"
          onClick={handleComplete}
        >
          ✓ Mark Complete
        </button>
      </div>

      {open && <TaskDetail task={task} onClose={() => setOpen(false)} />}
    </>
  );
}