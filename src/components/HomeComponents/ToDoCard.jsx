import { useState, useEffect } from "react";
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

const isOverdue = (d) => new Date(d) < new Date() && d;

export default function ToDoCard({ task }) {
      const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", priority: "medium", dueDate: "", notes: "" });
  const [showForm, setShowForm] = useState(false);

  // load tasks from db.json on mount
  useEffect(() => {
    fetch("http://localhost:3001/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;

    const res = await fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const saved = await res.json();
    setTasks(prev => [...prev, saved]); // add to UI instantly
    setForm({ title: "", priority: "medium", dueDate: "", notes: "" });
    setShowForm(false);
  };

  const [open, setOpen] = useState(false);
  const p = priorityConfig[task.priority] || priorityConfig.low;
  const overdue = isOverdue(task.dueDate);

  return (
    <>
      <div className="cards-container">
        {tasks.map(task => (
          <ToDoCard key={task.id} task={task} />
        ))}
      </div>
    </div>
      <div className="todo-card" onClick={() => setOpen(true)}>
        {/* priority strip */}
        <div className="todo-strip" style={{ background: p.color }} />

        <div className="todo-body">
          <div className="todo-top">
            {/* priority badge */}
            <span
              className="todo-priority"
              style={{ color: p.color, background: p.bg }}
            >
              {p.icon} {p.label}
            </span>

            {/* overdue flag */}
            {overdue && <span className="todo-overdue">Overdue</span>}
          </div>

          <p className="todo-title">{task.title}</p>

          {task.dueDate && (
            <p className="todo-date" style={{ color: overdue ? "#e74c3c" : "#888" }}>
              📅 {fmtDate(task.dueDate)}
            </p>
          )}

          {task.notes && (
            <p className="todo-preview">{task.notes}</p>
          )}
        </div>
      </div>

      {open && <TaskDetail task={task} onClose={() => setOpen(false)} />}
    </>
  );
}

