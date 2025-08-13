"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoutIcon } from "../Icons/icons"; 
import styles from "./styles.module.css";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/logout", { method: "POST" });
    setLoading(false);
    router.push("/sign-in");
  };

  return (
    <div className={styles.logoutContainer}>
      <button
        onClick={handleLogout}
        disabled={loading}
        className={styles.logoutButton}
        title="Logout"
      >
        <LogoutIcon />
      </button>
    </div>
  );
}

