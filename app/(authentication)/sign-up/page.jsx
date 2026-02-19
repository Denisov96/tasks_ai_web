"use client";

import { useSignUp } from "../../../hooks/useSignUp";
import styles from "../styles.module.css";

export default function SignUpPage() {
  const {
    userNameRef,
    passwordRef,
    confirmRef,
    error,
    isLoading,
    handleSubmit,
  } = useSignUp();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create an account</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="text"
              ref={userNameRef}
              className={styles.input}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              ref={passwordRef}
              className={styles.input}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirm" className={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              ref={confirmRef}
              className={styles.input}
              placeholder="Repeat your password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`${styles.button} ${styles.primaryButton}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
