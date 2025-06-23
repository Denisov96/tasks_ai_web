"use client";

import styles from "./styles.module.css";
import { useSignUp } from "../../hooks/useSignUp";

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
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>Create an account</h1>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.formLabel}>
            Username
          </label>
          <input
            id="username"
            type="text"
            ref={userNameRef}
            className={styles.formInput}
            placeholder="Enter your username"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.formLabel}>
            Password
          </label>
          <input
            id="password"
            type="password"
            ref={passwordRef}
            className={styles.formInput}
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirm" className={styles.formLabel}>
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            ref={confirmRef}
            className={styles.formInput}
            placeholder="Repeat your password"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
