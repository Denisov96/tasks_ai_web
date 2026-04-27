"use client";

import styles from "./styles.module.css";
import { useTaskHistoryCalendar } from "../../../hooks/useTaskHistoryCalendar";
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

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TaskHistoryPage() {
  const {
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
  } = useTaskHistoryCalendar();

  const formatSelectedDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getIntensity = (count) => {
    if (!count) return styles.level0;
    if (count === 1) return styles.level1;
    if (count === 2) return styles.level2;
    return styles.level3;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button onClick={prevMonth} className={styles.navBtn}>
            ‹
          </button>
          <h2 className={styles.title}>
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <button onClick={nextMonth} className={styles.navBtn}>
            ›
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.weekdays}>
          {WEEKDAYS.map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {days.map((date, i) => {
            if (!date) {
              return <div key={i} className={styles.emptyCell} />;
            }

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
              >
                <span className={styles.dayNumber}>{date.getDate()}</span>
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div className={styles.details}>
            <h3 className={styles.detailsTitle}>
              {formatSelectedDate(selectedDate)}
            </h3>

            {tasksForSelectedDay.length === 0 ? (
              <p className={styles.empty}>No completed tasks</p>
            ) : (
              tasksForSelectedDay.map((task) => (
                <div key={task.id} className={styles.taskItem}>
                  {task.text}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}