const API_BASE = "/api/tasks";

async function apiClient(url, method = "GET", body = null, headers = {}) {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
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

export async function fetchTasks() {
  try {
    const { data } = await apiClient(`${API_BASE}`, "GET");
    return data;
  } catch (e) {
    console.error("Failed to fetch tasks:", e.message);
    return [];
  }
}

export async function createTask(taskText) {
  if (!taskText?.trim()) {
    console.error("Task text is required");
    return [];
  }
  try {
    const { data } = await apiClient(`${API_BASE}`, "POST", {
      text: taskText.trim(),
    });
    return data;
  } catch (e) {
    console.error("Failed to create task:", e.message);
    return [];
  }
}

export async function updateTask({ id, text, completed, priority, order }) {
  if (!id) {
    console.error("Task ID is required");
    return null;
  }

  const body = { taskId: Number(id) };

  if (text != null) body.text = text.trim();
  if (completed != null) body.completed = completed;
  if (priority != null) body.priority = priority; 
  if (order != null) body.order = order;           

  try {
    const { data } = await apiClient(`${API_BASE}/${id}`, "PUT", body);
    return data;
  } catch (e) {
    console.error("Failed to update task:", e.message);
    return null;
  }
}

export async function deleteTask(taskId) {
  if (!taskId) {
    console.error("Task ID is required");
    return [];
  }
  try {
    const { data } = await apiClient(`${API_BASE}/${taskId}`, "DELETE", {
      taskId: Number(taskId),
    });
    return data;
  } catch (e) {
    console.error("Failed to delete task:", e.message);
    return [];
  }
}

export function validateUserId(userId) {
  if (!userId || isNaN(userId)) {
    return new Response(
      JSON.stringify({ error: "Invalid User ID" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  return null;
}