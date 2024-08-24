"use client";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function RootLayout({ children }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </DndProvider>
  );
}
