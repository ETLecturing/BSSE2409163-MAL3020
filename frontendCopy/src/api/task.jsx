const BASE_URL = "/api/tasks";

export async function fetchProjectTasks(projectId, token) {
  try {
    const res = await fetch(`${BASE_URL}?projectId=${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn("Fetch project tasks failed:", err);
    return [];
  }
}

export async function createTask(token, projectId, taskData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...taskData, projectId }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(token, taskId, taskData) {
  const res = await fetch(`${BASE_URL}/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTask(token, taskId) {
  const res = await fetch(`${BASE_URL}/${taskId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
}
