export default function DashboardSidebar({ allProjects, pinnedProjects, onProjectClick }) {
  const renderList = (title, items) => (
    <div style={{ marginBottom: "1.25rem" }}>
      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", color: "#444", letterSpacing: "0.5px" }}>
        {title}
      </h3>
      {items.length ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((item) => (
            <li
              key={item._id}
              onClick={() => onProjectClick(item)}
              style={{
                cursor: "pointer",
                padding: "0.35rem 0.6rem",
                color: "#007bff",
                textDecoration: "none",
                borderRadius: "6px",
                marginBottom: "3px",
                fontSize: "0.9rem",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e6f2ff";
                e.currentTarget.style.transform = "translateX(2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = "#cce0ff";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = "#e6f2ff";
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontStyle: "italic", color: "#888", fontSize: "0.85rem" }}>
          No {title.toLowerCase()}
        </p>
      )}
    </div>
  );

  return (
    <aside
      style={{
        width: "220px",
        padding: "1rem",
        borderRight: "1px solid #ddd",
        backgroundColor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {renderList("Pinned Projects", pinnedProjects)}
      {renderList("All Projects", allProjects)}
    </aside>
  );
}
