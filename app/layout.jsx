"use client";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Sometype_Mono } from "next/font/google";

const sometypeMono = Sometype_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <html lang="en" className={sometypeMono.className}>
        <body>{children}</body>
      </html>
    </DndProvider>
  );
}
