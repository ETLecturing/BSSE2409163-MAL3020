// src/api/projects.js
// Fetch pinned projects safely
export async function fetchPinnedProjects(token) {
  try {
    const res = await fetch("http://localhost:5000/api/projects/pinned", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn("Pinned Projects fetch failed, returning []", err);
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
    console.warn("Pinned Tasks fetch failed, returning []", err);
    return [];
  }
}



// Regular projects fetch is fine, just make it consistent:
export async function fetchProjects(token) {
  try {
    const res = await fetch("http://localhost:5000/api/projects", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Projects fetch failed:", data);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Fetch projects error:", err);
    return [];
  }
}
