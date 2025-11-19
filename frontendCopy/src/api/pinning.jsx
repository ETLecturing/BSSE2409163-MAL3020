// pinProject adds a project to the user's pinnedProjects array
export async function pinProject(userId, projectId, token) {
  return fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ $push: { pinnedProjects: projectId } }),
  });
}

// unpinProject removes a project from the user's pinnedProjects array
export async function unpinProject(userId, projectId, token) {
  return fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ $pull: { pinnedProjects: projectId } }),
  });
}
