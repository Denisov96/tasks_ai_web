"use client";

import { useSignUp } from "../../../hooks/useSignUp";
import styles from "../ui.module.css";

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
    <div className={styles.uiPage}>
      <div className={styles.uiCard}>
        <h1 className={styles.uiTitle}>
          Create an account
        </h1>

        {error && (
          <div className={styles.uiError}>{error}</div>
        )}

        <form
          className={styles.uiForm}
          onSubmit={handleSubmit}
        >
          <div className={styles.uiFormGroup}>
            <label htmlFor="username" className={styles.uiLabel}>
              Username
            </label>
            <input
              id="username"
              type="text"
              ref={userNameRef}
              className={styles.uiInput}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div className={styles.uiFormGroup}>
            <label htmlFor="password" className={styles.uiLabel}>
              Password
            </label>
            <input
              id="password"
              type="password"
              ref={passwordRef}
              className={styles.uiInput}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <div className={styles.uiFormGroup}>
            <label htmlFor="confirm" className={styles.uiLabel}>
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              ref={confirmRef}
              className={styles.uiInput}
              placeholder="Repeat your password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`${styles.uiButton} ${styles.uiButtonPrimary}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
