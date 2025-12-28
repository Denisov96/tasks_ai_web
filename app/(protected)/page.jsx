"use client";

import AuthGuard from "../../components/AuthGuard";
import { TasksView } from "../../views/TaskView";

export default function Page() {
  return (
    <AuthGuard>
      {(currentUser) => <TasksView currentUser={currentUser} />}
    </AuthGuard>
  );
}
