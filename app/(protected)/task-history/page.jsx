"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./styles.module.css";

export default function TaskHistoryPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/task-history", {
          credentials: "include",
        });

        const data = await res.json();

        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("History load error:", err);
        setTasks([]);
      }
    }

    loadHistory();
  }, []);

  const completedDates = tasks.map(
    (task) => new Date(task.completedAt).toISOString().split("T")[0],
  );

  const tasksForSelectedDate = selectedDate
    ? tasks.filter(
        (task) =>
          new Date(task.completedAt).toISOString().split("T")[0] ===
          selectedDate.toISOString().split("T")[0],
      )
    : [];

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Task Activity</h1>

        <Calendar
          onClickDay={setSelectedDate}
          tileClassName={({ date }) => {
            const formatted = date.toISOString().split("T")[0];
            return completedDates.includes(formatted)
              ? styles.completedDay
              : null;
          }}
        />

        {selectedDate && (
          <div className={styles.section}>
            <h2 className={styles.dateTitle}>{selectedDate.toDateString()}</h2>

            {tasksForSelectedDate.length === 0 ? (
              <p className={styles.empty}>No completed tasks</p>
            ) : (
              tasksForSelectedDate.map((task) => (
                <div key={task.id} className={styles.taskItem}>
                  <span className={styles.check}>✓</span>
                  <span>{task.text}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
