import "./Homecomponents.css"


const priorityConfig = {
  high:   { label: "High",   color: "#e74c3c", bg: "#fdecea", icon: "▲" },
  medium: { label: "Medium", color: "#e67e22", bg: "#fef3e2", icon: "●" },
  low:    { label: "Low",    color: "#27ae60", bg: "#e9f7ef", icon: "▼" },
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-KE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });


export default function TaskDetail () {

    const p = priorityConfig[task.priority] || priorityConfig.low;
    
    return (
        <>
        <div className="notebook-overlay" onClick={onClose}>
            <div className="notebook" onClick={(e) => e.stopPropagation()}>
                <div className="notebook-rings">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="ring" />
                    ))}
                </div>

        <div className="notebook-content">
          <button className="notebook-close" onClick={onClose}>✕</button>

          <div className="notebook-meta">
            <span className="todo-priority" style={{ color: p.color, background: p.bg }}>
              {p.icon} {p.label} Priority
            </span>
            {task.dueDate && (
              <span className="notebook-date">📅 {fmtDate(task.dueDate)}</span>
            )}
          </div>

          <h2 className="notebook-title">{task.title}</h2>

          <div className="notebook-lines">
            {task.notes
              ? task.notes.split("\n").map((line, i) => (
                  <div key={i} className="notebook-line">
                    <span>{line}</span>
                  </div>
                ))
              : [...Array(8)].map((_, i) => (
                  <div key={i} className="notebook-line empty" />
                ))
            }
          </div>
        </div>

      </div>
    </div>
        </>
    )
}
