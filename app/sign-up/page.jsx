"use client";

import { useSignUp } from "../../hooks/useSignUp";

export default function SignUpPage() {
  const {
    userNameRef,
    passwordRef,
    confirmRef,
    error,
    isLoading,
    handleSubmit,
  } = useSignUp();

  return (
    <div className="ui-page">
      <div className="ui-card">
        <h1 className="ui-title">Create an account</h1>

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

          <div className="ui-form-group">
            <label htmlFor="confirm" className="ui-label">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              ref={confirmRef}
              className="ui-input"
              placeholder="Repeat your password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="ui-button ui-button--primary"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
