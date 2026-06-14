import { useState, useEffect } from "react";
import ToDoCard from "../../components/HomeComponents/ToDoCard";
import ToDoForm from "../../components/HomeComponents/ToDoForm";
import { getUser, fetchTasks } from "../../api";
import "./Dash.css";

export default function ConsToDo() {
  const [tasks, setTasks] = useState([]);
  const handleComplete = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  useEffect(() => {
    const { id } = getUser();
    if (!id) return;

    fetchTasks(id)
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
        else setTasks([]);
      })
      .catch(() => setTasks([]));
  }, []);

  return (
    <div className="bss-page-container">
      <ToDoForm setTasks={setTasks} />
      <div className="cards-container">
        {tasks.map(task => (
          <ToDoCard key={task.id} task={task} onComplete={handleComplete} />
        ))}
      </div>
    </div>
  );
}