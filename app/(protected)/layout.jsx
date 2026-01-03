"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../styles.module.css";
import LogoutButton from "../../components/LogoutButton";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../hooks/useAuth";
import { useUser } from "../../hooks/useUser";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const user = useAuth();
  const { setCurrentUser } = useUser();
  const [openMenu, setOpenMenu] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  }

  useEffect(() => {
    if (user === false) router.replace("/sign-in");
    if (user) setCurrentUser(user);
  }, [user, router, setCurrentUser]);

  if (user === null) return <Spinner />;
  if (user === false) return null;

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
            <button
              onClick={toggleTheme}
              className={styles.menuLink}
              style={{ background: "none", border: "none", padding: 0 }}
            >
              {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
            </button>
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
