import { useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/userContext";

export function useSignIn() {
  const userNameRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentUser } = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
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
  };

  return {
    userNameRef,
    passwordRef,
    handleSubmit,
    error,
    isLoading,
  };
}
