"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../layout";
import { TasksView } from "../../views/TaskView"; 



export default function Page() {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/signin");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return <TasksView currentUser={currentUser} />;
}
