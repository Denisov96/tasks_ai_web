"use client";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserContext.Provider");
  }
  return context; 
}
