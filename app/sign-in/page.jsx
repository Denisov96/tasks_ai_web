"use client";

import { useRef, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../layout";
import styles from "./styles.module.css";
import Link from 'next/link';

export default function SignInPage() {
  const userNameRef = useRef();
  const passwordRef = useRef();
  const { setCurrentUser } = useContext(UserContext);
  const router = useRouter();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const username = userNameRef.current.value.trim();
    const password = passwordRef.current.value;

    if (!username || !password) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setCurrentUser(result.data);

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

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
          Don't have an account?{" "}
          <Link className={styles.signupLink} href="/sign-up">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
