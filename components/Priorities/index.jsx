"use client";

import { ChevronsUp, Minus, ChevronDown } from "lucide-react";
import styles from "./styles.module.css";

const PRIORITY_CONFIG = {
  HIGH: {
    label: "High",
    icon: ChevronsUp,
    color: "#ef4444",
    weight: 3,
  },
  MEDIUM: {
    label: "Medium",
    icon: Minus,
    color: "#eab308",
    weight: 2,
  },
  LOW: {
    label: "Low",
    icon: ChevronDown,
    color: "#3b82f6",
    weight: 1,
  },
};

const PRIORITY_LIST = Object.entries(PRIORITY_CONFIG).map(
  ([value, config]) => ({
    value,
    ...config,
  })
);

export const getPriority = (value) =>
  PRIORITY_CONFIG[value] || PRIORITY_CONFIG.MEDIUM;

export const getPriorityWeight = (value) =>
  PRIORITY_CONFIG[value]?.weight ?? 2;

export function PrioritySelect({
  value,
  isOpen,
  onToggle,
  onChange,
}) {
  const current = getPriority(value);
  const CurrentIcon = current.icon;

  return (
    <div className={styles.wrapper}>
      <div className={styles.selected} onClick={onToggle}>
        <span style={{ color: current.color }}>
          <CurrentIcon size={16} />
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {PRIORITY_LIST.map((p) => {
            const Icon = p.icon;

            return (
              <div
                key={p.value}
                className={styles.option}
                onClick={() => onChange(p.value)}
              >
                <span style={{ color: p.color }}>
                  <Icon size={16} />
                </span>
                {p.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}