"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import { useAuth } from "../../hooks/useAuth";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
    if (user === false) {
      router.replace("/sign-in");
    }
  }, [user, router]);

  if (user === null) {
    return <Spinner />;
  }

  if (user === false) {
    return null;
  }

  return children(user);
}
