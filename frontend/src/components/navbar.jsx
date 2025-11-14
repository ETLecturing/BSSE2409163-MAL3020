export default function DashboardNavbar({ username, onLogout }) {
  return (
    <nav
      style={{
        height: "60px",
        backgroundColor: "#1f1f1f",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        fontWeight: 500,
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <span style={{ fontSize: "1.2rem", letterSpacing: "0.5px" }}>Dashboard</span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <span style={{ fontSize: "0.95rem", color: "#ccc" }}>
          Welcome, <strong>{username || "User"}</strong>
        </span>
        <button
          onClick={onLogout}
          style={{
            padding: "0.4rem 1rem",
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 500,
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff7875")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff4d4f")}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
