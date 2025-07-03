"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { TasksView } from "../views/TaskView";

export default function Page() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth === false) {
      router.replace("/sign-in");
    }
  }, [auth, router]);

  if (auth === null) return <p>Authenticated</p>;
  if (auth === false) return null;

  return <TasksView currentUser={auth} />;
}
