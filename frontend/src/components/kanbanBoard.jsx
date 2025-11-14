import { useState } from "react";

// Accepts tasks array, each task should have { _id, title, status }
export default function KanbanBoard({ tasks }) {
  const columns = ["To Do", "In Progress", "Done"];
  const [taskColumns, setTaskColumns] = useState(() => {
    const colObj = { "To Do": [], "In Progress": [], Done: [] };
    tasks.forEach((t) => {
      const status = columns.includes(t.status) ? t.status : "To Do";
      colObj[status].push(t);
    });
    return colObj;
  });

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      {columns.map((col) => (
        <div
          key={col}
          style={{
            flex: 1,
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "8px",
            minHeight: "300px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>{col}</h3>
          {taskColumns[col].length ? (
            taskColumns[col].map((task) => (
              <div
                key={task._id}
                style={{
                  background: "#fff",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                {task.title}
              </div>
            ))
          ) : (
            <p style={{ fontStyle: "italic", color: "#888" }}>No tasks</p>
          )}
        </div>
      ))}
    </div>
  );
}
