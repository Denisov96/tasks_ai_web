"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Roboto } from "next/font/google";
import "./global.css";
import styles from "../styles.module.css";
import { UserContext } from "../context/userContext";
import LogoutButton from "../components/LogoutButton";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  display: "swap",
});

export default function RootLayout({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const didMountRef = useRef(false);

  const pathname = usePathname();

  const hideMenu = pathname === "/sign-in" || pathname === "/sign-up";

  useEffect(() => {
    setIsMounted(true);
    didMountRef.current = true;
  }, []);

  useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

  if (!isMounted) return null;

  return (
    <html lang="en" className={roboto.className}>
      <body>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          {!hideMenu && (
            <>
              <button
                className={styles.hamburger}
                onClick={() => {
                  if (!didMountRef.current) return;
                  setOpenMenu(true);
                }}
              >
                ☰
              </button>

              <nav
                className={`${styles.sidebar} ${openMenu ? styles.open : ""}`}
              >
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
                <div
                  className={styles.overlay}
                  onClick={() => setOpenMenu(false)}
                />
              )}
            </>
          )}

          <main>{children}</main>
        </UserContext.Provider>
      </body>
    </html>
  );
}
