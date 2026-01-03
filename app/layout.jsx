"use client";

import { useEffect, useState } from "react";
import { Roboto } from "next/font/google";
import "./global.css";
import { UserContext } from "../context/userContext";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  display: "swap",
});

export default function RootLayout({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <html lang="en" className={roboto.className}>
      <body>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          {children}
        </UserContext.Provider>
      </body>
    </html>
  );
}
