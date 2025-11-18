// DashboardNavbar.jsx
export default function DashboardNavbar({ username, onLogout }) {
  return (
    <nav
      style={{
        height: "60px",
        backgroundColor: "#1a1a1a", // softer than pure black
        color: "#e0e0e0",           // muted text
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        fontWeight: 500,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)", // lighter shadow
        backdropFilter: "blur(4px)", // subtle glass effect
      }}
    >
      <span style={{ fontSize: "1.3rem", letterSpacing: "0.5px" }}>Dashboard</span>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "0.95rem", color: "#aaa" }}>
          Welcome, <strong>{username || "User"}</strong>
        </span>

        <button
          onClick={onLogout}
          style={{
            padding: "0.45rem 1rem",
            backgroundColor: "#d9534f", // muted red
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 500,
            transition: "all 0.2s ease",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#e66b6c"; // hover slightly brighter
            e.currentTarget.style.transform = "translateY(-1px)"; // subtle lift
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#d9534f";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
