"use client";

import styles from "./styles.module.css";

export function IconButton({
  children,
  onClick,
  className = "",
  title,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      className={`${styles["icon-button"]} ${className}`}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}

