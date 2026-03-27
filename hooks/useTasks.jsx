"use client";
import { useState, useEffect } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../lib/requests";

export function useTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const fetched = await fetchTasks(userId);
        setTasks(fetched || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setTasks([]);
      }
    }
    loadTasks();
  }, [userId]);

  const handleSubmit = async () => {
    if (!taskToEdit?.text?.trim()) return;

    try {
      if (taskToEdit.id) {
        const updatedTask = await updateTask(taskToEdit, userId);
        setTasks((prev) =>
          prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
        );
      } else {
        const newTask = await createTask(taskToEdit.text, userId);
        setTasks((prev) => [...prev, newTask]);
      }
      setTaskToEdit(null);
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleDeleteTasks = async (ids) => {
    try {
      for (const id of ids) await deleteTask(id, userId);
      setTasks((prev) => prev.filter((t) => !ids.includes(t.id)));
    } catch (error) {
      console.error("Error deleting tasks", error);
    }
  };

  return {
    tasks,
    setTasks,
    taskToEdit,
    setTaskToEdit,
    handleSubmit,
    handleDeleteTasks,
  };
}
