export default function ProjectCard({ project, onClick }) {
  return (
    <div
      onClick={() => onClick?.(project)}
      style={{
        width: "250px",
        height: "180px",
        border: "1px solid #ccc",
        borderRadius: "12px",
        padding: "1rem",
        margin: "0.5rem",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        transition: "transform 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <h3 style={{ margin: "0 0 0.5rem 0" }}>{project.name}</h3>
      <p style={{ flex: 1, margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#555" }}>
        {project.description || "No description"}
      </p>
      <p style={{ fontSize: "0.8rem", color: "#777" }}>
        Team: {project.team?.map((u) => u.name).join(", ") || "No team"}
      </p>
    </div>
  );
}
