// LoginForm.jsx
import { useState } from "react";
import { login } from "../api/auth";

export default function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.token) onLoginSuccess(result.token);
    else alert(result.message || "Login failed");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "380px",
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        backgroundColor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>
        Login
      </h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          border: "1px solid #ddd",
          outline: "none",
          fontSize: "1rem",
          transition: "0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#1e90ff")}
        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          border: "1px solid #ddd",
          outline: "none",
          fontSize: "1rem",
          transition: "0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#1e90ff")}
        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
      />
      <button
        type="submit"
        style={{
          padding: "0.75rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#1e90ff",
          color: "#fff",
          fontWeight: "600",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1c86ee")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e90ff")}
      >
        Login
      </button>
    </form>
  );
}
