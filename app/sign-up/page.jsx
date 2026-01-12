"use client";

import styles from "./styles.module.css";
import { useSignUp } from "../../hooks/useSignUp";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "../../components/Icons/icons"; 

export default function SignUpPage() {
  const {
    userNameRef,
    passwordRef,
    confirmRef,
    error,
    isLoading,
    handleSubmit,
  } = useSignUp();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className={styles.pageContainer}>
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
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
                className={styles.formInput}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirm" className={styles.formLabel}>
              Confirm Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="confirm"
                type={showConfirmPassword ? "text" : "password"}
                ref={confirmRef}
                className={styles.formInput}
                placeholder="Repeat your password"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
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
    </div>
  );
}