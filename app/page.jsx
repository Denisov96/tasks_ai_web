"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../app/context/userContext";
import { TasksView } from "../views/TaskView";

export default function Page() {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/sign-in");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return <TasksView currentUser={currentUser} />;
}
