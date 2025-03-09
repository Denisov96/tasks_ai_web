"use client";
import { useState } from "react";
import { LoginView } from "../views/LoginView";
import { TasksView } from "../views/TasksView";

export default function Page() {
  const [currentUser, setCurrentUser] = useState();

  if (!currentUser) return <LoginView onSuccess={(user) => setCurrentUser(user)}  />;

  return <TasksView currentUser={currentUser} />;
}
