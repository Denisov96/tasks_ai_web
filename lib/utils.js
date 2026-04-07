import { getPriorityWeight } from "../components/Priorities";

export function booleanSort(prev, curr) {
  return prev === curr ? 0 : prev ? 1 : -1;
}

export function sortTasks(tasks = []) {
  return [...tasks].sort((a, b) => {
    const completedCompare = booleanSort(a.completed, b.completed);
    if (completedCompare !== 0) return completedCompare;

    if (a.priority !== b.priority) {
      return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    }

    return (a.order || 0) - (b.order || 0);
  });
}
