async function makeRequest(url, method = "GET", body = null, headers = {}) {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

export async function getTasks(userId) {
  if (!userId) {
    console.error("User ID is required");
    return [];
  }

  try {
    const { data } = await makeRequest(
      "http://localhost:3000/api/tasks",
      "GET",
      null,
      {
        userid: userId.toString(),
      }
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch tasks:", error.message);
    return [];
  }
}

export async function createTask(taskText, userId) {
  if (!userId) {
    console.error("User ID is required");
    return [];
  }

  if (!taskText?.trim()) {
    console.error("Task text cannot be empty");
    return [];
  }

  try {
    const { data } = await makeRequest(
      "http://localhost:3000/api/tasks",
      "POST",
      { text: taskText.trim() },
      { userid: userId.toString() }
    );
    return data;
  } catch (error) {
    console.error("Failed to create task:", error.message);
    return [];
  }
}

export async function updateTask(taskData) {
  if (!taskData?.id) {
    console.error("Task ID is required");
    return [];
  }

  if (taskData.text?.trim() === "") {
    console.error("Task text cannot be empty");
    return [];
  }

  try {
    const { data } = await makeRequest(
      "http://localhost:3000/api/tasks",
      "PUT",
      {
        id: taskData.id,
        text: taskData.text?.trim(),
        completed: taskData.completed,
      }
    );
    return data;
  } catch (error) {
    console.error("Failed to update task:", error.message);
    return [];
  }
}
