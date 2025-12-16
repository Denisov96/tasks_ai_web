"use client";

import { useContext } from "react";
import { UserContext } from "../context/userContext";

export function useUser() {
  const context = useContext(UserContext);
  return context; 
}
