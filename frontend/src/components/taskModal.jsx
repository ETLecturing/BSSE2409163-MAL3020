import { useState, useEffect } from "react";

export default function TaskModal({ task, onClose, onSave, onDelete, team = [] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [assignedTo, setAssignedTo] = useState([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status || "Pending");
      setAssignedTo(task.assignedTo || []);
    } else {
      setTitle("");
      setDescription("");
      setStatus("Pending");
      setAssignedTo([]);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description, status, assignedTo });
  };

  const toggleAssign = (id) => {
    setAssignedTo((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={overlay}>
      <form style={form} onSubmit={handleSubmit}>
        <h2>{task ? "Edit Task" : "Add Task"}</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={textareaStyle}
        />

        <div>
          <strong>Status:</strong>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginTop: "0.3rem" }}>
            {["Pending", "Ongoing", "Completed"].map((s) => (
              <label key={s}>
                <input
                  type="radio"
                  value={s}
                  checked={status === s}
                  onChange={() => setStatus(s)}
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div>
          <strong>Assign To:</strong>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginTop: "0.3rem" }}>
            {team.map((member) => (
              <label key={member._id}>
                <input
                  type="checkbox"
                  checked={assignedTo.includes(member._id)}
                  onChange={() => toggleAssign(member._id)}
                />
                {member.name}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <button type="submit">{task ? "Save" : "Add"}</button>
          <button type="button" onClick={onClose}>Cancel</button>
          {task && (
            <button type="button" style={{ background: "red", color: "#fff" }} onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "sans-serif",
};

const form = { background: "#fff", padding: "2rem", borderRadius: "8px", width: "320px", display: "flex", flexDirection: "column", gap: "1rem" };
const inputStyle = { padding: "0.5rem", fontSize: "1rem" };
const textareaStyle = { padding: "0.5rem", fontSize: "0.95rem", minHeight: "80px", resize: "vertical" };
