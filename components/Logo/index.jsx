import styles from "./styles.module.css";

export function Logo() {
  return (
    <div className={styles.logo}>
      <span className={styles.logoSymbol}>//</span>
      <span className={styles.logoText}>task</span>
      <span className={styles.logoAccent}>.ai</span>
    </div>
  );
}