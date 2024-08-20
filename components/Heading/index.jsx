import styles from "./styles.module.css"


export function Heading(props) {
  return <h1 className={styles.h1}>{props.text}</h1>;
}
