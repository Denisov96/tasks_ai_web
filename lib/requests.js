export async function getTasks() {
  const response = await fetch("http://localhost:3000/api/tasks");

  if (!response.ok) {
    console.error(`Cannot fetch tasks. Response status ${response.status}`);
    return;
  }

  const responseObject = await response.json();

  return responseObject.data;
}

export async function updateTask(updatedTask) {
  if (updatedTask.text.trim() === "") return;

  const response = await fetch("http://localhost:3000/api/tasks", {
    method: "PUT",
    body: JSON.stringify({
      id: updatedTask.id,
      text: updatedTask.text,
      completed: updatedTask.completed,
    }),
  });

  if (!response.ok) {
    console.error(`Cannot update task. Response status ${response.status}`);
    return;
  }

  const responseObject = await response.json();

  return responseObject.data;
}

export async function createTask(taskText) {
  const response = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    body: taskText,
  });

  if (!response.ok) {
    console.error(`Cannot create new task. Response status ${response.status}`);
    return;
  }

  const responseObject = await response.json();

  return responseObject.data;
}
