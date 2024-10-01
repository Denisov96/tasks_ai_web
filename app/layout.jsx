"use client";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Roboto } from "next/font/google"; 

const roboto = Roboto({
  weight: ["400", "700"], 
  subsets: ["latin", "cyrillic"], 
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <html lang="en" className={roboto.className}> 
        <body>{children}</body>
      </html>
    </DndProvider>
  );
}


