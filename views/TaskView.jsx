"use client";

import { useUser } from "../hooks/useUser";
import { TaskInput } from "../components/TaskInput";
import { TaskList } from "../components/TaskList";
import { Logo } from "../components/Logo";
import styles from "../app/sidebar.module.css";
import { useTasks } from "../hooks/useTasks";

export function TasksView() {
  const { currentUser } = useUser();

  if (!currentUser) return null;

  const {
    tasks,
    setTasks,
    taskToEdit,
    setTaskToEdit,
    handleDeleteTasks,
    handleSubmit,
  } = useTasks(currentUser.id);

  return (
    <div className={styles.pageContainer}>
      <Logo />

      <TaskInput
        tasks={tasks}
        userId={currentUser.id}
        onChangeTasks={setTasks}
      />

      <TaskList
        tasks={tasks}
        onChange={setTasks}
        onEdit={(task) => setTaskToEdit(task)}
        userId={currentUser.id}
      />
    </div>
  );
}
