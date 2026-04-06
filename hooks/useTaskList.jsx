"use client";

import { useMemo } from "react";
import { updateTask } from "../lib/requests";
import { getPriorityWeight } from "../components/Priorities";

export function useTaskList({ tasks = [], onChange, userId }) {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      if (a.priority !== b.priority) {
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      }

      return (a.order || 0) - (b.order || 0);
    });
  }, [tasks]);

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [moved] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, moved);

    const prev = updatedTasks[toIndex - 1];
    const next = updatedTasks[toIndex + 1];

    let newOrder;
    if (!prev) newOrder = (next?.order || 1) - 1;
    else if (!next) newOrder = (prev?.order || 0) + 1;
    else newOrder = (prev.order + next.order) / 2;

    moved.order = newOrder;

    onChange(updatedTasks);

    updateTask({ id: moved.id, order: newOrder }).catch((err) =>
      console.error("Update order error:", err),
    );
  };

  const toggleTaskCompleted = async (id, completed) => {
    onChange(tasks.map((t) => (t.id === id ? { ...t, completed } : t)));

    try {
      const updatedTask = await updateTask({ id, completed });

      onChange((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      );
    } catch (error) {
      console.error("Toggle error:", error.message);
    }
  };

  const changeTaskPriority = async (id, priority) => {
    onChange(tasks.map((t) => (t.id === id ? { ...t, priority } : t)));

    try {
      const updatedTask = await updateTask({ id, priority });

      onChange((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      );
    } catch (error) {
      console.error("Priority update error:", error.message);
    }
  };

  return {
    sortedTasks,
    moveTask,
    toggleTaskCompleted,
    changeTaskPriority,
  };
}