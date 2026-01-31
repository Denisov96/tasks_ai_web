"use client";

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
    <div className="ui-page">
      <div className="ui-card">
        <h1 className="ui-title">Sign in to your account</h1>

        {error && <div className="ui-error">{error}</div>}

        <form className="ui-form" onSubmit={handleSubmit}>
          <div className="ui-form-group">
            <label htmlFor="username" className="ui-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              ref={userNameRef}
              className="ui-input"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div className="ui-form-group">
            <label htmlFor="password" className="ui-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              ref={passwordRef}
              className="ui-input"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="ui-button ui-button--primary"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
