"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { TasksView } from "../views/TaskView";
import Spinner from "../components/Spinner";

export default function Page() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth === false) {
      router.replace("/sign-in");
    }
  }, [auth, router]);

  if (!auth) return auth === null ? <Spinner /> : null;

  return <TasksView currentUser={auth} />;
}
