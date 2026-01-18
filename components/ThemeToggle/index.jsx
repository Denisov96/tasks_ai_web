"use client";

import { useTheme } from "../../context/themeContext";
import { SunIcon, MoonIcon } from "../Icons/icons";
import styles from "./styles.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      data-theme={theme}
    >
      <div className={styles.toggleTrack}>
        <div className={styles.toggleThumb}>
          {theme === "light" ? (
            <SunIcon className={styles.icon} size={14} />
          ) : (
            <MoonIcon className={styles.icon} size={14} />
          )}
        </div>
      </div>

      <span className={styles.toggleText}>
        {theme === "light" ? "Dark mode" : "Light mode"}
      </span>
    </button>
  );
}
