export default function DashboardSidebar({ allProjects, pinnedProjects, pinnedTasks, onProjectClick }) {
  const renderList = (title, items, isTask = false) => (
    <div style={{ marginBottom: "1.5rem" }}>
      <h3>{title}</h3>
      {items.length ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item._id}
              onClick={() => !isTask && onProjectClick(item)}
              style={{
                cursor: !isTask ? "pointer" : "default",
                padding: "0.3rem 0.5rem",
                color: !isTask ? "#007bff" : "#555",
                textDecoration: !isTask ? "underline" : "none",
                borderRadius: "4px",
                marginBottom: "2px",
                transition: "background-color 0.2s, transform 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!isTask) e.currentTarget.style.backgroundColor = "#f0f8ff";
                e.currentTarget.style.transform = "translateX(3px)";
              }}
              onMouseLeave={(e) => {
                if (!isTask) e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }}
              onMouseDown={(e) => {
                if (!isTask) e.currentTarget.style.backgroundColor = "#d0e8ff";
              }}
              onMouseUp={(e) => {
                if (!isTask) e.currentTarget.style.backgroundColor = "#f0f8ff";
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontStyle: "italic", color: "#888" }}>No {title.toLowerCase()}</p>
      )}
    </div>
  );

  return (
    <aside
      style={{
        width: "220px",
        padding: "1rem",
        borderRight: "1px solid #ccc",
      }}
    >
      {renderList("Pinned Projects", pinnedProjects)}
      {renderList("All Projects", allProjects)}
      {renderList("Pinned Tasks", pinnedTasks, true)}
    </aside>
  );
}
