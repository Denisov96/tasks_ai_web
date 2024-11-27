import Image from "next/image";
import styles from "./styles.module.css";

export function Logo() {
  return (
    <Image
      src="/images/logo.png"
      alt="Logo"
      width={80}
      height={80}
      className={styles.image}
    />
  );
}
