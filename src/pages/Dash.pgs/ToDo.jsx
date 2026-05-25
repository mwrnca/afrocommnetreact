// import "./Dash.css"
// import ToDoCard from "../../components/HomeComponents/ToDoCard"

// export default function ToDo () {

// const tasks = [
//   {
//     id: 1,
//     title: "Review Q2 financials",
//     priority: "high",
//     dueDate: "2026-05-30",
//     notes: "Go through the reports\nHighlight any discrepancies\nPrepare summary for board"
//   },
//   {
//     id: 2,
//     title: "Update client database",
//     priority: "medium",
//     dueDate: "2026-06-10",
//     notes: "Add new entries from last week"
//   },
//   {
//     id: 3,
//     title: "Send weekly newsletter",
//     priority: "low",
//     dueDate: "2026-06-15",
//     notes: ""
//   },
// ];

// const [tasks, setTasks] = useState([]);
//   const [form, setForm] = useState({ title: "", priority: "medium", dueDate: "", notes: "" });
//   const [showForm, setShowForm] = useState(false);

//   // load tasks from db.json on mount
//   useEffect(() => {
//     fetch("http://localhost:3001/tasks")
//       .then(res => res.json())
//       .then(data => setTasks(data));
//   }, []);

//   const handleChange = (e) => {
//     setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async () => {
//     if (!form.title.trim()) return;

//     const res = await fetch("http://localhost:3001/tasks", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     const saved = await res.json();
//     setTasks(prev => [...prev, saved]); // add to UI instantly
//     setForm({ title: "", priority: "medium", dueDate: "", notes: "" });
//     setShowForm(false);
//   };

//     return (
//         <div>
// <div>
//       <button onClick={() => setShowForm(prev => !prev)}>
//         {showForm ? "Cancel" : "+ Add Task"}
//       </button>

//       {showForm && (
//         <div className="task-form">
//           <input
//             name="title"
//             placeholder="Task title"
//             value={form.title}
//             onChange={handleChange}
//           />
//           <select name="priority" value={form.priority} onChange={handleChange}>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//           <input
//             name="dueDate"
//             type="date"
//             value={form.dueDate}
//             onChange={handleChange}
//           />
//           <textarea
//             name="notes"
//             placeholder="Notes..."
//             value={form.notes}
//             onChange={handleChange}
//           />
//           <button className="btn-savetask" onClick={handleSubmit}>
//             Save Task
//           </button>
//         </div>
//       )}
//             <div>
//                 {tasks.map(task => (
//                 <ToDoCard key={task.id} task={task} />
//                 ))}
//             </div>
            
//         </div>
//     )
// }
