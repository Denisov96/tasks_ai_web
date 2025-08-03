"use client";
import { useState, useEffect } from "react";
import { fetchTasks, updateTask, createTask, deleteTask } from "../lib/requests";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    async function fetchAndSetTasks() {
      try {
        const tasks = await fetchTasks();
        setTasks(tasks || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setTasks([]);
      }
    }
    fetchAndSetTasks();
  }, []);

  const handleDeleteTasks = async (ids) => {
    try {
      for (const id of ids) {
        await deleteTask(id);
      }
      const updatedTasks = await fetchTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting tasks", error);
    }
  };

  const handleSubmit = async () => {
    if (!taskToEdit || !taskToEdit.text || taskToEdit.text.trim() === "") return;

    try {
      const newTasks = taskToEdit.id
        ? await updateTask(taskToEdit)
        : await createTask(taskToEdit.text);
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
