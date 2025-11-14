export default function DashboardSidebar({ allProjects, pinnedProjects, pinnedTasks }) {
  const renderList = (title, items) => (
    <div style={{ marginBottom: "1.5rem" }}>
      <h3>{title}</h3>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item._id}>{item.name}</li>
          ))}
        </ul>
      ) : (
        <p style={{ fontStyle: "italic", color: "#888" }}>No {title.toLowerCase()}</p>
      )}
    </div>
  );

  return (
    <aside style={{
      width: "220px",
      padding: "1rem",
      borderRight: "1px solid #ccc",
    }}>
      {renderList("All Projects", allProjects)}
      {renderList("Pinned Projects", pinnedProjects)}
      {renderList("Pinned Tasks", pinnedTasks)}
    </aside>
  );
}
