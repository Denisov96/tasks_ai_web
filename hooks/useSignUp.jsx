"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../hooks/useUser";

export function useSignUp() {
  const userNameRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();

  const { setCurrentUser } = useUser();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
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

      if (!res.ok) throw new Error(result.error || "Something went wrong");

      setCurrentUser(result.data);
      router.push("/sign-in");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userNameRef,
    passwordRef,
    confirmRef,
    error,
    isLoading,
    handleSubmit,
  };
}
