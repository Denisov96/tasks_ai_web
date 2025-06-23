import { useState, useEffect } from "react";
import { fetchTasks, updateTask, createTask, deleteTask } from "../lib/requests";

export function useTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    async function fetchAndSetTasks() {
      try {
        const tasks = await fetchTasks(userId);
        setTasks(tasks || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setTasks([]);
      }
    }

    fetchAndSetTasks();
  }, [userId]);

  const handleDeleteTasks = async (ids) => {
    try {
      const updatedTasks = await deleteTask(null, userId, ids);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting tasks", error);
    }
  };

  const handleSubmit = async () => {
    if (!taskToEdit || !taskToEdit.text || taskToEdit.text.trim() === "") return;

    try {
      const newTasks = taskToEdit.id
        ? await updateTask(taskToEdit, userId)
        : await createTask(taskToEdit.text, userId);
      setTasks(newTasks || []);
      setTaskToEdit(null);
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  return {
    tasks,
    setTasks,
    taskToEdit,
    setTaskToEdit,
    handleDeleteTasks,
    handleSubmit,
  };
}
