import { useState, useEffect } from "react";
import TaskModal from "../components/taskModal";
import {
  fetchProjectTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/task";

export default function KanbanBoard({ projectId, token, team = [] }) {
  const columns = ["To Do", "In Progress", "Done"];
  const [taskColumns, setTaskColumns] = useState({
    "To Do": [],
    "In Progress": [],
    Done: [],
  });
  const [allTasks, setAllTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks when projectId changes
  useEffect(() => {
    if (!projectId) return;
    async function loadTasks() {
      const tasks = await fetchProjectTasks(projectId, token);
      setAllTasks(tasks);
      setTaskColumns(groupByStatus(tasks));
    }
    loadTasks();
  }, [projectId, token]);

  useEffect(() => {
  if (!projectId || !token) return;

  const s = io("http://localhost:5000");

  // listen for task refresh events
  s.on("refreshTask", async (updatedProjectId) => {
    if (updatedProjectId === projectId) { // only refresh for this project
      const tasks = await fetchProjectTasks(projectId, token);
      setAllTasks(tasks);
      setTaskColumns(groupByStatus(tasks));
    }
  });

  return () => s.disconnect(); // cleanup on unmount
}, [projectId, token]);


  const statusMap = {
    Pending: "To Do",
    Ongoing: "In Progress",
    Completed: "Done",
  };

  const groupByStatus = (tasks) => {
    const colObj = { "To Do": [], "In Progress": [], Done: [] };
    tasks.forEach((t) => {
      const status = statusMap[t.status] || "To Do";
      colObj[status].push(t);
    });
    return colObj;
  };

  const openModalForTask = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
      let updatedTasks;
      if (editingTask) {
        const updated = await updateTask(token, editingTask._id, taskData);
        updatedTasks = allTasks.map((t) =>
          t._id === updated._id ? updated : t
        );
      } else {
        const newTask = await createTask(token, projectId, taskData);
        updatedTasks = [newTask, ...allTasks];
      }
      setAllTasks(updatedTasks);
      setTaskColumns(groupByStatus(updatedTasks));
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save task");
    }
  };

  const handleDeleteTask = async (task) => {
    if (!task) return;
    if (!confirm(`Delete task "${task.title}"?`)) return;
    try {
      await deleteTask(token, task._id);
      const filteredTasks = allTasks.filter((t) => t._id !== task._id);
      setAllTasks(filteredTasks);
      setTaskColumns(groupByStatus(filteredTasks));
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <button
        onClick={() => openModalForTask()}
        style={{
          width: "150px",
          padding: "0.5rem",
          borderRadius: "6px",
          border: "none",
          background: "#007bff",
          color: "#fff",
          cursor: "pointer",
          alignSelf: "flex-start",
        }}
      >
        + Add Task
      </button>

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
                    cursor: "pointer",
                  }}
                  onClick={() => openModalForTask(task)}
                >
                  <div style={{ fontWeight: "bold" }}>{task.title}</div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#555",
                      marginTop: "0.25rem",
                    }}
                  >
                    Assigned:{" "}
                    {task.assignedTo && task.assignedTo.length > 0
                      ? task.assignedTo
                          .map((idOrObj) => {
                            // if object with name use that, otherwise use id to lookup team
                            const id =
                              typeof idOrObj === "object"
                                ? idOrObj._id
                                : idOrObj;
                            return team.find((m) => m._id === id)?.name;
                          })
                          .filter(Boolean)
                          .join(", ")
                      : "Unassigned"}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontStyle: "italic", color: "#888" }}>No tasks</p>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          team={team}
          onClose={closeModal}
          onSave={handleSaveTask}
          onDelete={() => handleDeleteTask(editingTask)}
        />
      )}
    </div>
  );
}
