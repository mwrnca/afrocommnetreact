import { useState, useEffect } from "react";
import ToDoCard from "../../components/HomeComponents/ToDoCard";
import ToDoForm from "../../components/HomeComponents/ToDoForm";
import "./Dash.css";

export default function BssToDo() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.id) return;
    
    fetch(`http://localhost:8000/tasks${user.id}`)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <div className="bss-page-container">

      <ToDoForm setTasks={setTasks} />

      <div className="cards-container">
        {tasks.map(task => (
          <ToDoCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}