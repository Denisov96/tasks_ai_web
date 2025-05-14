import { useRef, useState } from "react";
import styles from "./styles.module.css"; 

export function LoginView(props) {
  const userNameInputRef = useRef();
  const passwordInputRef = useRef();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
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
        body: JSON.stringify({ username: userName, password: password})
      });

      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
      }

      const currentUser = await response.json();
      props.onSuccess(currentUser.data);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>Sign in to your account</h1>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <form className={styles.loginForm} onSubmit={handleSignIn}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.formLabel}>
            Username
          </label>
          <input
            type="text"
            id="username"
            ref={userNameInputRef}
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
        
        <button
          type="submit"
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      
      <div className={styles.loginFooter}>
        Don't have an account?{" "}
        <a href="#" className={styles.signupLink}>
          Sign up
        </a>
      </div>
    </div>
  );
}