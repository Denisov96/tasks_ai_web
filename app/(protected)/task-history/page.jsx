"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import { getLocalDateKey } from "../../../lib/date";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function TaskHistoryPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const year = today.getFullYear();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/task-history", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load");

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid data");

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
    const lastDay = new Date(year, currentMonth + 1, 0);

    for (let d = 1; d <= lastDay.getDate(); d++) {
      result.push(new Date(year, currentMonth, d));
    }

    return result;
  }, [year, currentMonth]);

  const getIntensity = (count) => {
    if (!count) return styles.level0;
    if (count === 1) return styles.level1;
    if (count === 2) return styles.level2;
    return styles.level3;
  };

  const tasksForSelectedDay = selectedDate
    ? tasks.filter(
        (task) =>
          task.completedAt &&
          getLocalDateKey(task.completedAt) === selectedDate,
      )
    : [];

  const prevMonth = () => {
    setSelectedDate(null);
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
  };

  const nextMonth = () => {
    setSelectedDate(null);
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button onClick={prevMonth} className={styles.navBtn}>
            ‹
          </button>
          <h2 className={styles.title}>
            {MONTHS[currentMonth]} {year}
          </h2>
          <button onClick={nextMonth} className={styles.navBtn}>
            ›
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.daysGrid}>
          {days.map((date) => {
            const key = getLocalDateKey(date);
            const count = activityMap[key] || 0;
            const isActive = selectedDate === key;

            return (
              <div
                key={key}
                onClick={() => setSelectedDate(key)}
                className={`
                  ${styles.day}
                  ${getIntensity(count)}
                  ${isActive ? styles.selected : ""}
                `}
                title={`${key} — ${count} tasks`}
              >
                <span className={styles.dayNumber}>{date.getDate()}</span>
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div className={styles.details}>
            <h3 className={styles.detailsTitle}>{selectedDate}</h3>

            {tasksForSelectedDay.length === 0 ? (
              <p className={styles.empty}>No completed tasks</p>
            ) : (
              tasksForSelectedDay.map((task) => (
                <div key={task.id} className={styles.taskItem}>
                  ✓ {task.text}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
