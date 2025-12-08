"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../../styles.module.css";
import LogoutButton from "../../components/LogoutButton";

export default function ProtectedLayout({ children }) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <button className={styles.hamburger} onClick={() => setOpenMenu(true)}>
        ☰
      </button>

      <nav className={`${styles.sidebar} ${openMenu ? styles.open : ""}`}>
        <button
          className={styles.closeButton}
          onClick={() => setOpenMenu(false)}
        >
          ✕
        </button>

        <ul className={styles.menu}>
          <li>
            <Link href="/" className={styles.menuLink}>
              Tasks
            </Link>
          </li>
          <li>
            <Link href="/task-history" className={styles.menuLink}>
              Task History
            </Link>
          </li>
          <li>
            <Link href="/priorities" className={styles.menuLink}>
              Priorities
            </Link>
          </li>
          <li>
            <Link href="/categories" className={styles.menuLink}>
              Categories
            </Link>
          </li>
          <li>
            <Link href="/theme" className={styles.menuLink}>
              Theme
            </Link>
          </li>
        </ul>

        <LogoutButton />
      </nav>

      {openMenu && (
        <div className={styles.overlay} onClick={() => setOpenMenu(false)} />
      )}

      <main>{children}</main>
    </>
  );
}
