"use client";

import { useRef, useState } from "react";
import styles from "./styles.module.css";

export function LoginView(props) {

  const userNameRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();

  const [isSignUp, setIsSignUp] = useState(false);

  const userNameInputRef = useRef();
  const passwordInputRef = useRef();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const username = userNameRef.current.value.trim();
    const password = passwordRef.current.value;
    const confirmPassword = isSignUp ? confirmRef.current.value : null;

    
    if (!username || !password || (isSignUp && !confirmPassword)) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {

      const endpoint = isSignUp ? "/api/signUp" : "/api/signIn";
      const body = isSignUp
        ? { username, password, confirmPassword }
        : { username, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),

      const userName = userNameInputRef.current.value.trim();

      const password = passwordInputRef.current.value;
      
      if (!userName) {
        setError("Username is required");
        return;
      }

       if (!password) {
        setError("Password is required");
        return;
      }

      const response = await fetch("http://localhost:3000/api/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: userName, password: password})

      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      props.onSuccess(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>
        {isSignUp ? "Create an account" : "Sign in to your account"}
      </h1>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        {}
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
          
          <label htmlFor="password" className={styles.formLabel}>
            Password
          </label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            className={styles.formInput}
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        {}
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

        {}
        {isSignUp && (
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
        )}

        <button
          type="submit"
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading
            ? isSignUp
              ? "Signing up..."
              : "Signing in..."
            : isSignUp
            ? "Sign up"
            : "Sign in"}
        </button>
      </form>

      <div className={styles.loginFooter}>
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsSignUp(false);
                setError(null);
              }}
              className={styles.signupLink}
            >
              Sign in
            </a>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsSignUp(true);
                setError(null);
              }}
              className={styles.signupLink}
            >
              Sign up
            </a>
          </>
        )}
      </div>
    </div>
  );
}
