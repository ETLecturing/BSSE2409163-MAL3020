// src/api/projects.js
export async function fetchProjects(token) {
  try {
    const res = await fetch("http://localhost:5000/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Fetch projects error:", err);
    return [];
  }
}

export async function fetchPinnedProjects(token) {
  try {
    const res = await fetch("http://localhost:5000/api/projects/pinned", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Fetch pinned projects error:", err);
    return [];
  }
}

export async function fetchPinnedTasks(token) {
  try {
    const res = await fetch("http://localhost:5000/api/tasks/pinned", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Fetch pinned tasks error:", err);
    return [];
  }
}
