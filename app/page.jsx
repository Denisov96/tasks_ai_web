"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { TasksView } from "../views/TaskView";
import Spinner from "../components/Spinner";
import styles from "../styles.module.css";

export default function Page() {
  const router = useRouter();
  const auth = useAuth();

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (auth === false) {
      router.replace("/sign-in");
    }
  }, [auth, router]);

  if (!auth) return auth === null ? <Spinner /> : null;

  return (
    <>
      <button className={styles.hamburger} onClick={() => setOpenMenu(true)}>
        ☰
      </button>

      <nav className={`${styles.sidebar} ${openMenu ? styles.open : ""}`}>
        <button className={styles.close} onClick={() => setOpenMenu(false)}>
          ✕
        </button>

        <ul className={styles.menu}>
          <li>Task History</li>
          <li>Priorities</li>
          <li>Categories</li>
          <li>Theme</li>
        </ul>
      </nav>

      {openMenu && (
        <div className={styles.overlay} onClick={() => setOpenMenu(false)} />
      )}

      <TasksView currentUser={auth} />
    </>
  );
}
