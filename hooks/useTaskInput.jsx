"use client";
import { useState } from "react";
import { createTask, deleteTask, fetchTasks } from "../lib/requests";

export function useTaskInput({ tasks = [], onChangeTasks }) {
  const [value, setValue] = useState("");

  const hasCompletedTasks = tasks.some((task) => task.completed);

  const onChange = (newValue) => {
    setValue(newValue);
  };

  const onSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    try {
      await createTask(trimmed);
      const updatedTasks = await fetchTasks();
      onChangeTasks && onChangeTasks(updatedTasks);
      setValue("");
    } catch (error) {
      console.error("Add task error:", error.message);
    }
  };

  const deleteCompletedTasks = async () => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    if (!completedIds.length) return;

    try {
      for (const taskId of completedIds) {
        await deleteTask(taskId);
      }
      const updatedTasks = await fetchTasks();
      onChangeTasks && onChangeTasks(updatedTasks);
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  return {
    value,
    hasCompletedTasks,
    onChange,
    onSubmit,
    deleteCompletedTasks,
  };
}
