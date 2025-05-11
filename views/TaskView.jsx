"use client";
import { useState, useEffect } from "react";
import { Logo } from "../components/Logo";
import { TaskInput } from "../components/TaskInput";
import { TaskList } from "../components/TaskList";
import styles from "../styles.module.css";
import { fetchTasks, updateTask, createTask, deleteTask } from "../lib/requests";

export function TasksView(props) {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    async function fetchAndSetTasks() {
      try {
        const tasks = await fetchTasks(props.currentUser.id);
        setTasks(tasks || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setTasks([]);
      }
    }
    fetchAndSetTasks();
  }, [props.currentUser.id]);

  async function handleDeleteTasks(ids) {
    try {
      const updatedTasks = await deleteTask(null, props.currentUser.id, ids);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting tasks", error);
    }
  }

  async function handleSubmit() {
    if (!taskToEdit || !taskToEdit.text || taskToEdit.text.trim() === "") {
      return;
    }

    try {
      const newTasks = taskToEdit.id
        ? await updateTask(taskToEdit, props.currentUser.id)
        : await createTask(taskToEdit.text, props.currentUser.id);
      setTasks(newTasks || []);
      setTaskToEdit(null);
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <Logo />
      <TaskInput
        value={taskToEdit?.text || ""}
        onSubmit={handleSubmit}
        onChange={(value) => {
          if (taskToEdit) {
            setTaskToEdit({ ...taskToEdit, text: value });
          } else {
            setTaskToEdit({ text: value });
          }
        }}
        tasks={tasks}
        deleteTasks={handleDeleteTasks}
        userId={props.currentUser.id}
        onChangeTasks={setTasks}
      />
      <hr />
      <TaskList
        tasks={tasks}
        onChange={setTasks}
        onEdit={(task) => setTaskToEdit(task)}
        userId={props.currentUser.id}
      />
    </div>
  );
}
