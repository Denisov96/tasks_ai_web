const API_BASE = "/api/tasks";

async function apiClient(url, method = "GET", body = null, headers = {}) {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body != null) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(url, config);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getTasks(userId) {
  if (!userId || isNaN(userId)) {
    console.error("Valid User ID is required");
    return [];
  }
  try {
    const { data } = await apiClient(
      `${API_BASE}`,
      "GET",
      null,
      { userId }
    );
    return data;
  } catch (e) {
    console.error("Failed to fetch tasks:", e.message);
    return [];
  }
}

export async function createTask(taskText, userId) {
  if (!userId || isNaN(userId) || !taskText?.trim()) {
    console.error("Valid User ID and task text are required");
    return [];
  }
  try {
    const { data } = await apiClient(
      `${API_BASE}`,
      "POST",
      { text: taskText.trim() },
      { userId }
    );
    return data;
  } catch (e) {
    console.error("Failed to create task:", e.message);
    return [];
  }
}

export async function updateTask({ id, text, completed }, userId) {
  if (!userId || isNaN(userId) || !id) {
    console.error("Valid User ID and Task ID are required");
    return [];
  }
  const body = { taskId: Number(id) };
  if (text != null)  body.text = text.trim();
  if (completed != null) body.completed = completed;

  try {
    const { data } = await apiClient(
      `${API_BASE}/${id}`,
      "PUT",
      body,
      { userId }
    );
    return data;
  } catch (e) {
    console.error("Failed to update task:", e.message);
    return [];
  }
}

export async function deleteTask(taskId, userId) {
  if (!userId || isNaN(userId) || !taskId) {
    console.error("Valid User ID and Task ID are required");
    return [];
  }
  try {
    const { data } = await apiClient(
      `${API_BASE}/${taskId}`,
      "DELETE",
      { taskId: Number(taskId) },
      { userId }
    );
    return data;
  } catch (e) {
    console.error("Failed to delete task:", e.message);
    return [];
  }
}