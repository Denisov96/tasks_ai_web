"use client";

import { Logo } from "../components/Logo";
import { TaskInput } from "../components/TaskInput";
import { TaskList } from "../components/TaskList";
import styles from "../styles.module.css";
import { useTasks } from "../hooks/useTasks";

export function TasksView({ currentUser }) {
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
        value={taskToEdit?.text || ""}
        onSubmit={handleSubmit}
        onChange={(value) =>
          taskToEdit
            ? setTaskToEdit({ ...taskToEdit, text: value })
            : setTaskToEdit({ text: value })
        }
        tasks={tasks}
        deleteTasks={handleDeleteTasks}
        userId={currentUser.id}
        onChangeTasks={setTasks}
      />

      <hr />

      <TaskList
        tasks={tasks}
        onChange={setTasks}
        onEdit={(task) => setTaskToEdit(task)}
        userId={currentUser.id}
      />
    </div>
  );
}
