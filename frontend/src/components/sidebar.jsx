export default function DashboardSidebar({ allProjects, pinnedProjects, pinnedTasks, onProjectClick }) {
  const renderList = (title, items, isTask = false) => (
    <div style={{ marginBottom: "1.5rem" }}>
      <h3>{title}</h3>
      {items.length ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item._id}
              onClick={() => !isTask && onProjectClick(item)} // tasks can be non-clickable or handle differently
              style={{
                cursor: !isTask ? "pointer" : "default",
                padding: "0.3rem 0",
                color: !isTask ? "#007bff" : "#555",
                textDecoration: !isTask ? "underline" : "none",
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
      {renderList("Pinned Tasks", pinnedTasks, true)} {/* tasks non-clickable */}
    </aside>
  );
}
