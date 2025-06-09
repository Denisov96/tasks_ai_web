"use client";

import { useRef, useState } from "react";
import styles from "./styles.module.css";

export default function SignUpPage(props) {
  const userNameRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const username = userNameRef.current.value.trim();
    const password = passwordRef.current.value;
    const confirmPassword = confirmRef.current.value;

    if (!username || !password || !confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, confirmPassword }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      props?.onSuccess?.(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

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

        <button type="submit" className={styles.loginButton} disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
