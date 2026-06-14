import { useState, useEffect } from "react";
import ToDoCard from "../../components/HomeComponents/ToDoCard";
import ToDoForm from "../../components/HomeComponents/ToDoForm";
import { getUser, fetchTasks } from "../../api";
import "./Dash.css";

export default function InstToDo() {
  const [tasks, setTasks] = useState([]);

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
          <ToDoCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}