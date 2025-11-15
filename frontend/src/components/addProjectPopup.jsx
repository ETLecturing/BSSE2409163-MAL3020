import React, { useState } from "react";

export default function ProjectModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Project name is required");
      return;
    }
    onSubmit({ name, description });
    setName("");
    setDescription("");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose} // close when clicking outside
    >
      <div
        onClick={(e) => e.stopPropagation()} // prevent modal close on inner click
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          width: "320px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Create Project</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }}
                required
              />
            </label>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }}
                rows={3}
              />
            </label>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <button type="button" onClick={onClose} style={{ padding: "0.4rem 0.8rem" }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: "0.4rem 0.8rem", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
