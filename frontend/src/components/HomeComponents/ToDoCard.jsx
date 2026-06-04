import { useState } from "react";
import TaskDetail from "./TaskDetail";
import "./Homecomponents.css"

const priorityConfig = {
  high:   { label: "High",   color: "#e74c3c", bg: "#fdecea", icon: "▲" },
  medium: { label: "Medium", color: "#e67e22", bg: "#fef3e2", icon: "●" },
  low:    { label: "Low",    color: "#27ae60", bg: "#e9f7ef", icon: "▼" },
};

const date = (d) => {
    new Date (d).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric"
    })
}

const checkOverdue = (d) => new Date(d) < new Date && d;

export default function ToDoCard ({task}) {

    const [ open, setOpen] = useState(false);
    const overdue = checkOverdue(task.dueDate);
    const p = priorityConfig[task.priority] || priorityConfig.low;

    return (
        <>
        <div className="todo-card" onClick={() => setOpen(true)}>
            <div className="card-header">
                <span className="to-do-priority" style={{ color: p.color }}>
                    {p.icon} {p.label}
                </span>
                {overdue && <span className="todo-overdue">Overdue</span>}
            </div>
            <p className="todo-title">{task.title}</p>
            {task.dueDate && (
            <p className="todo-date" style={{ color: overdue ? "#e74c3c" : "#888" }}>
              {"📅"} {date(task.dueDate)}
            </p>
          )}
          {task.notes && <p className="todo-preview">{task.notes}</p>}
        </div>


        {open && <TaskDetail task={task} onClose={() => setOpen(false)} />}
        </>
    )
}