// src/api/auth.js
export async function login(username, password) {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  const data = await res.json();

  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data._id);
  localStorage.setItem("username", data.username);

  return data;
}




export async function register({ name, username, password }) {
  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, password }),
    });

    return await res.json();
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, message: "Network error" };
  }
}

