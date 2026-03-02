"use client";

import { useEffect, useMemo, useState } from "react";
import { getLocalDateKey } from "../lib/date";

export function useTaskHistoryCalendar() {
  const today = new Date();

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/task-history", {
          credentials: "include",
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error();

        setTasks(data);
      } catch {
        setError("Failed to load activity");
      }
    }

    load();
  }, []);

  const activityMap = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (!task.completedAt) return;
      const key = getLocalDateKey(task.completedAt);
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [tasks]);

  const days = useMemo(() => {
    const result = [];
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    for (let d = 1; d <= lastDay.getDate(); d++) {
      result.push(new Date(currentYear, currentMonth, d));
    }

    return result;
  }, [currentMonth, currentYear]);

  const tasksForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    return tasks.filter(
      (task) =>
        task.completedAt && getLocalDateKey(task.completedAt) === selectedDate,
    );
  }, [selectedDate, tasks]);

  const prevMonth = () => {
    setSelectedDate(null);

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    setSelectedDate(null);

    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return {
    days,
    activityMap,
    tasksForSelectedDay,
    selectedDate,
    setSelectedDate,
    currentMonth,
    currentYear,
    prevMonth,
    nextMonth,
    error,
  };
}
