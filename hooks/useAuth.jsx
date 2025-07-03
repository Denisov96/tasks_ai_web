import { useState, useEffect } from "react";

export function useAuth() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const authResponse = await fetch("/api/verifyAuth", {
          method: "GET",
          credentials: "include",
        });

        if (!authResponse.ok) {
          setAuth(false);
        } else {
          const user = await authResponse.json();
          setAuth(user);
        }
      } catch (err) {
        setAuth(false);
      }
    }

    checkAuth();
  }, []);

  return auth;
}


