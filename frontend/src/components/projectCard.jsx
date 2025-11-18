export default function ProjectCard({
  project,
  pinnedProjects = [], // pass the current pinnedProjects from parent
  onClick,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
}) {
  const isPinned = pinnedProjects.some((p) => p._id === project._id);

  return (
    <div
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
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div onClick={() => onClick?.(project)}>
        <h3 style={{ margin: "0 0 0.5rem 0" }}>{project.name}</h3>
        <p
          style={{
            flex: 1,
            margin: "0 0 0.5rem 0",
            fontSize: "0.9rem",
            color: "#555",
          }}
        >
          {project.description || "No description"}
        </p>
        <p style={{ fontSize: "0.8rem", color: "#777" }}>
          Team: {project.team?.map((u) => u.name).join(", ") || "No team"}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            if (isPinned) {
              await onUnpin?.(project);
            } else {
              await onPin?.(project);
            }
          }}
          style={{ fontSize: "0.75rem" }}
        >
          {isPinned ? "📌 Unpin" : "📌 Pin"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(project);
          }}
          style={{ fontSize: "0.75rem" }}
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(project);
          }}
          style={{ fontSize: "0.75rem", color: "red" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
