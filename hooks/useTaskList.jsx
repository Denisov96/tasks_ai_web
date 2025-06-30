"use client";

import { useMemo } from "react";
import { updateTask } from "../lib/requests";
import { booleanSort } from "../lib/utils";

export function useTaskList({ tasks = [], onChange, userId }) {
  const sortedTasks = useMemo(() => {
    return tasks.toSorted((prev, curr) =>
      booleanSort(prev.completed, curr.completed)
    );
  }, [tasks]);

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    onChange(updatedTasks);
  };

  const toggleTaskCompleted = async (id, completed) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, completed };
    });

    onChange(updatedTasks);

    try {
      const updated = await updateTask({ id, completed }, userId);
      onChange(updated);
    } catch (error) {
      console.error("Toggle error:", error.message);
    }
  };

  return {
    sortedTasks,
    moveTask,
    toggleTaskCompleted,
  };
}
