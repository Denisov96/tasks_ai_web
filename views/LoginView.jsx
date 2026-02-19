"use client";

import { useRef, useState } from "react";

export function LoginView(props) {
  const userNameRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();

  const [isSignUp, setIsSignUp] = useState(false);
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
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");

      props.onSuccess(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="ui-page">
      <div className="ui-card">
        <h1 className="ui-title">
          {isSignUp ? "Create an account" : "Sign in to your account"}
        </h1>

        {error && <div className="ui-error">{error}</div>}

        <form className="ui-form" onSubmit={handleSubmit}>
          <div className="ui-form-group">
            <label className="ui-label">Username</label>
            <input
              ref={userNameRef}
              className="ui-input"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div className="ui-form-group">
            <label className="ui-label">Password</label>
            <input
              type="password"
              ref={passwordRef}
              className="ui-input"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          {isSignUp && (
            <div className="ui-form-group">
              <label className="ui-label">Confirm password</label>
              <input
                type="password"
                ref={confirmRef}
                className="ui-input"
                placeholder="Repeat your password"
                disabled={isLoading}
              />
            </div>
          )}

          <button
            type="submit"
            className="ui-button ui-button--primary"
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

        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.75rem" }}>
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
              >
                Sign up
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
