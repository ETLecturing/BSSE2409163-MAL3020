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

// Fetch tasks for a specific project using existing /api/tasks route
export async function fetchProjectTasks(projectId, token) {
  try {
    const res = await fetch(`http://localhost:5000/api/tasks?projectId=${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Project tasks fetch failed:", data);
      return [];
    }

    return await res.json(); // backend returns array
  } catch (err) {
    console.warn("Project tasks fetch failed, returning []", err);
    return [];
  }
}

export const createProject = async (token, { name, description = "", team = [] }) => {
  const res = await fetch("http://localhost:5000/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description, team }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to create project");
  }

  return res.json(); // returns the created project object
};

// project.js
export const deleteProject = async (token, projectId) => {
  const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Failed to delete project");
  }

  return res.json(); // optional: can return deleted project info
};


export const updateProject = async (token, projectId, data) => {
  const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Failed to update project");
  }

  return res.json(); // returns updated project object
};


export async function updateProjectTeam(projectId, team) {
  try {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team }),
    });
    if (!res.ok) throw new Error("Failed to update project team");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
