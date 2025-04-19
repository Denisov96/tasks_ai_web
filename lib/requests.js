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
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

export async function getTasks(userId) {
  if (!userId || isNaN(userId)) {
    console.error("Valid User ID is required");
    return [];
  }

  try {
    const { data } = await makeRequest(
      `http://localhost:3000/api/users/${userId}/tasks`
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch tasks:", error.message);
    return [];
  }
}

export async function createTask(taskText, userId) {
  if (!userId || isNaN(userId) || !taskText?.trim()) {
    console.error("Valid User ID and task text are required");
    return [];
  }

  try {
    const { data } = await makeRequest(
      `http://localhost:3000/api/users/${userId}/tasks`,
      "POST",
      { text: taskText.trim() }
    );
    return data;
  } catch (error) {
    console.error("Failed to create task:", error.message);
    return [];
  }
}

export async function updateTask(taskData, userId) {
  if (!userId || isNaN(userId) || !taskData?.id) {
    console.error("Valid User ID and Task ID are required");
    return [];
  }

  try {
    const { data } = await makeRequest(
      `http://localhost:3000/api/users/${userId}/tasks`,
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

export async function deleteTask(userId, options = {}) {
  if (!userId || isNaN(userId)) {
    console.error("Valid User ID is required");
    return [];
  }

  const { id, ids } = options;

  if (!id && !Array.isArray(ids)) {
    console.error("Task ID or IDs array required");
    return [];
  }

  const payload = id ? { id: Number(id) } : { ids: ids.map(Number) };

  try {
    const response = await fetch(
      `http://localhost:3000/api/users/${userId}/tasks`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete task:", error.message);
    return [];
  }
}
