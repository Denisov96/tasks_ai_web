"use client";
import { useState } from "react";
import { Task } from "../components/Task";
import styles from "../styles.module.css";

export default function Page() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Buy Milk" },
    { id: 2, text: "Repair the door" },
    { id: 3, text: "Throw garbage" },
    { id: 4, text: "Cook a dinner" },
  ]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  const completeTask = (index) => {
    const taskToComplete = tasks[index];
    setTasks(tasks.filter((_, i) => i !== index));
    setCompletedTasks([
      ...completedTasks,
      { ...taskToComplete, completed: true },
    ]);
  };

  const revertTask = (index) => {
    const taskToRevert = completedTasks[index];
    setCompletedTasks(completedTasks.filter((_, i) => i !== index));
    setTasks([...tasks, { ...taskToRevert, completed: false }]);
  };

  const addNewTask = () => {
    if (newTaskText.trim() === "") return;
    const newTask = { id: Date.now(), text: newTaskText };
    setTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  return (
    <div className={styles.pageContainer}>
      {}
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Enter a new task..."
          className={styles.input}
        />
        <button onClick={addNewTask} className={styles.addButton}>
          Add Task
        </button>
      </div>

      <h3 className={styles.h3}>What I want to do</h3>

      {tasks.map((task, index) => (
        <Task
          key={task.id}
          id={task.id}
          text={task.text}
          index={index}
          onMove={moveTask}
          onComplete={completeTask}
          onRevert={() => {}}
          isCompleted={false}
        />
      ))}

      <h3 className={styles.h3}>What I have done</h3>

      {completedTasks.map((task, index) => (
        <Task
          key={task.id}
          id={task.id}
          text={task.text}
          index={index}
          onMove={() => {}}
          onComplete={() => {}}
          onRevert={revertTask}
          isCompleted={true}
        />
      ))}
    </div>
  );
}
