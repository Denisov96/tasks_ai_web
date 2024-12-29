import React from "react";
import { Roboto } from "next/font/google";
import "../vars.css";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
     <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  );
}