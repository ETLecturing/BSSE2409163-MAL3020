// src/api/user.jsx
export async function searchUsers(username) {
  if (!username) return [];
  try {
    const res = await fetch(`/api/users/search?username=${encodeURIComponent(username)}`);
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}
