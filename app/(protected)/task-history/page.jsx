"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./styles.module.css";
import { isSameDay, formatDate } from "../../../lib/date";

export default function TaskHistoryPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/task-history", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        setTasks(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load task history");
      }
    }

    loadHistory();
  }, []);

  const tasksForSelectedDate = selectedDate
    ? tasks.filter(task =>
        isSameDay(task.completedAt, selectedDate)
      )
    : [];

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Task Activity</h1>

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        <Calendar
          onClickDay={setSelectedDate}
          tileClassName={({ date }) =>
            tasks.some(task =>
              isSameDay(task.completedAt, date)
            )
              ? styles.completedDay
              : null
          }
        />

        {selectedDate && (
          <div className={styles.section}>
            <h2 className={styles.dateTitle}>
              {formatDate(selectedDate)}
            </h2>

            {tasksForSelectedDate.length === 0 ? (
              <p className={styles.empty}>
                No completed tasks
              </p>
            ) : (
              tasksForSelectedDate.map(task => (
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