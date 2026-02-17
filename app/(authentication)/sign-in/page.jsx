"use client";

import Link from "next/link";
import { useSignIn } from "../../../hooks/useSignIn";
import styles from "../styles.module.css";

export default function SignInPage() {
  const { userNameRef, passwordRef, handleSubmit, error, isLoading } =
    useSignIn();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in to your account</h1>

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

          <button
            type="submit"
            className={`${styles.button} ${styles.primaryButton}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account? <Link href="/sign-up">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
