"use client";

import { useState } from "react";
import styles from "./styles.module.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={styles.hamburger} onClick={() => setOpen(true)}>
        ☰
      </button>

      <nav className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <button className={styles.close} onClick={() => setOpen(false)}>
          ✕
        </button>

        <ul className={styles.menu}>
          <li>🗓 Task History</li>
          <li>⭐ Priorities</li>
          <li>📁 Categories</li>
          <li>⚙️ Theme</li>
        </ul>
      </nav>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}
    </>
  );
}
