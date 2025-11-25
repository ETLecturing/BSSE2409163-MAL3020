import React from "react";

export default function AddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005ecb")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
    >
      + Add Project
    </button>
  );
}
