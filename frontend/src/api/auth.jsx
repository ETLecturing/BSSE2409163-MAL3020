// src/api/auth.js
export async function login(username, password) {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Network error" };
  }
}

export async function register(username, password) {
  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, message: "Network error" };
  }
}
