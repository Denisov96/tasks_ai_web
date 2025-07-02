"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../hooks/useUser";
import { TasksView } from "../views/TaskView";

export default function Page() {
  const router = useRouter();
  const { currentUser } = useUser();

  useEffect(() => {
    if (!currentUser) {
      router.replace("/sign-in");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return <TasksView currentUser={currentUser} />;
}
