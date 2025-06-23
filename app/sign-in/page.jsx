"use client";

import styles from "./styles.module.css";
import Link from "next/link";
import { useSignIn } from "../../hooks/useSignIn";

export default function SignInPage() {
  const {
    userNameRef,
    passwordRef,
    handleSubmit,
    error,
    isLoading,
  } = useSignIn();

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>Sign in to your account</h1>

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

        <button
          type="submit"
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className={styles.loginFooter}>
        <p>
          Don&apos;t have an account?{" "}
          <Link className={styles.signupLink} href="/sign-up">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
