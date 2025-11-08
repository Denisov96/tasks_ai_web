"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Roboto } from "next/font/google";
import "../vars.css";
import { UserContext } from "../context/userContext";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  display: "swap",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    if (auth && auth !== false) {
      setCurrentUser(auth);
    }
  }, [auth]);

  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  return (
    <html lang="en" className={roboto.className}>
      <body>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          
          {!isAuthPage && currentUser && <Sidebar />}

          {children}
        </UserContext.Provider>
      </body>
    </html>
  );
}
