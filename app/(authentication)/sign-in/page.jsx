"use client";

import Link from "next/link";
import { useSignIn } from "../../../hooks/useSignIn";
import styles from "../ui.module.css";

export default function SignInPage() {
  const {
    userNameRef,
    passwordRef,
    handleSubmit,
    error,
    isLoading,
  } = useSignIn();

  return (
    <div className={styles.uiPage}>
      <div className={styles.uiCard}>
        <h1 className={styles.uiTitle}>
          Sign in to your account
        </h1>

        {error && (
          <div className={styles.uiError}>{error}</div>
        )}

        <form
          className={styles.uiForm}
          onSubmit={handleSubmit}
        >
          <div className={styles.uiFormGroup}>
            <label
              htmlFor="username"
              className={styles.uiLabel}
            >
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
            <label
              htmlFor="password"
              className={styles.uiLabel}
            >
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

          <button
            type="submit"
            className={`${styles.uiButton} ${styles.uiButtonPrimary}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className={styles.uiFooter}>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
