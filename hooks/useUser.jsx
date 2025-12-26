import { useContext } from "react";
import { UserContext } from "../context/userContext";

export function useUser() {
  const context = useContext(UserContext);

  if (process.env.NODE_ENV !== "production" && context === null) {
    throw new Error(
      "useUser must be used within <UserContext.Provider>"
    );
  }

  return context;
}

