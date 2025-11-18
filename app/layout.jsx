"use client";

import { useState } from "react";
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
