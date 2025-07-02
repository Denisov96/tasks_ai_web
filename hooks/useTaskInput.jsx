"use client";

import { useState } from "react";
import { deleteTask, fetchTasks, createTask } from "../lib/requests";

export function useTaskInput({ tasks = [], userId, onChangeTasks }) {
  const [value, setValue] = useState("");

  const hasCompletedTasks = tasks.some((task) => task.completed);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    try {
      await createTask(trimmed, userId);
      const updatedTasks = await fetchTasks(userId);
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
        await deleteTask(taskId, userId);
      }

      const updatedTasks = await fetchTasks(userId);
      onChangeTasks && onChangeTasks(updatedTasks);
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  return {
    value,
    hasCompletedTasks,
    onChange: handleChange,
    onSubmit: handleSubmit,
    deleteCompletedTasks,
  };
}
