import { useEffect, useRef } from "react";
import { ChevronsUp, Minus, ChevronDown } from "lucide-react";
import styles from "./styles.module.css";

const PRIORITY_CONFIG = {
  HIGH: { label: "High", icon: ChevronsUp, color: "#ef4444", weight: 3 },
  MEDIUM: { label: "Medium", icon: Minus, color: "#eab308", weight: 2 },
  LOW: { label: "Low", icon: ChevronDown, color: "#3b82f6", weight: 1 },
};

const PRIORITY_LIST = Object.entries(PRIORITY_CONFIG).map(
  ([value, config]) => ({ value, ...config }),
);

export const getPriority = (value) =>
  PRIORITY_CONFIG[value] || PRIORITY_CONFIG.MEDIUM;

export const getPriorityWeight = (value) => PRIORITY_CONFIG[value]?.weight ?? 2;

export function PrioritySelect({ value, isOpen, onToggle, onChange, onClose }) {
  const current = getPriority(value);
  const CurrentIcon = current.icon;

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className={styles.wrapper}>
      <div className={styles.selected} onClick={onToggle}>
        <span style={{ color: current.color }}>
          <CurrentIcon size={16} />
        </span>
      </div>

      <div
        className={`${styles.dropdown} ${isOpen ? styles.open : styles.closed}`}
      >
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
    </div>
  );
}
