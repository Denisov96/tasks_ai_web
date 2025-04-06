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
  if (!userId || !taskText?.trim()) {
    console.error("Task text and user ID are required");
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

export async function updateTask(taskData, userId) {
  if (!taskData?.id || !userId) {
    console.error("Task ID and user ID are required");
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
      },
      {
        userid: userId.toString(),
      }
    );
    return data;
  } catch (error) {
    console.error("Failed to update task:", error.message);
    return [];
  }
}

export async function deleteTask(taskId, userId, ids = []) {
  if (!userId || (!taskId && ids.length === 0)) {
    console.error("User ID and task ID(s) are required");
    return [];
  }

  try {
    const body = taskId ? { id: taskId } : { ids };
    const { data } = await makeRequest(
      "http://localhost:3000/api/tasks",
      "DELETE",
      body,
      { userid: userId.toString() }
    );
    return data;
  } catch (error) {
    console.error("Failed to delete task:", error.message);
    return [];
  }
}
