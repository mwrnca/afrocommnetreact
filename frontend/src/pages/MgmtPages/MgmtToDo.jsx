import { useState, useEffect } from "react";
import ToDoCard from "../../components/HomeComponents/ToDoCard";
import "./Dash.css";

export default function MgmtToDo() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", priority: "medium", dueDate: "", notes: "" });

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
    setTasks(prev => [...prev, saved]);
    setForm({ title: "", priority: "medium", dueDate: "", notes: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div>
      <button className="add-new-task" onClick={() => setShowForm(prev => !prev)}>
        {showForm ? "CANCEL X" : "+ ADD NEW TASK"}
      </button>
      </div>

      {showForm && (
        <div className="task-form">
          <input
            name="title"
            placeholder="Task title"
            value={form.title}
            onChange={handleChange}
          />
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />
          <textarea
            name="notes"
            placeholder="Notes..."
            value={form.notes}
            onChange={handleChange}
          />
          <button onClick={handleSubmit}>Save Task</button>
        </div>
      )}

      <div className="cards-container">
        {tasks.map(task => (
          <ToDoCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}