import React, { useState, useEffect } from "react";
import { searchUsers } from "../api/user";

export default function ProjectModal({ isOpen, onClose, onSubmit, project }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [team, setTeam] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setDescription(project.description || "");
      setTeam(project.team || []);
    } else {
      setName("");
      setDescription("");
      setTeam([]);
    }
  }, [project, isOpen]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Project name is required");
      return;
    }
    onSubmit({
      name,
      description,
      team: team.map((u) => u._id),
    });
  };

  const handleSearchClick = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const results = await searchUsers(searchTerm);
      const mappedResults = results
        .map((u) => ({ _id: u._id, name: u.username }))
        .filter((u) => !team.some((t) => t._id === u._id));
      setSearchResults(mappedResults);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    }
    setLoading(false);
  };

  const addTeamMember = (user) => {
    if (!team.some((u) => u._id === user._id)) setTeam((prev) => [...prev, user]);
    setSearchResults((prev) => prev.filter((u) => u._id !== user._id));
  };

  const removeTeamMember = (userId) => {
    setTeam((prev) => prev.filter((u) => u._id !== userId));
  };

  if (!isOpen) return null;

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
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          width: "400px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>
          {project ? "Edit Project" : "Create Project"}
        </h2>

        <form onSubmit={handleFormSubmit}>
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

          <div style={{ marginBottom: "1rem" }}>
            <p style={{ marginBottom: "0.5rem" }}>Team Members:</p>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by username..."
                style={{ flex: 1, padding: "0.4rem" }}
              />
              <button type="button" onClick={handleSearchClick} style={{ padding: "0.4rem 0.8rem" }}>
                Search
              </button>
            </div>

            {loading && <p>Loading...</p>}

            {searchResults.length > 0 && (
              <ul style={{ maxHeight: "100px", overflowY: "auto", padding: 0 }}>
                {searchResults.map((user) => (
                  <li
                    key={user._id}
                    style={{ listStyle: "none", padding: "0.3rem", cursor: "pointer", borderBottom: "1px solid #eee" }}
                    onClick={() => addTeamMember(user)}
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            )}

            {team.length > 0 && (
              <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                {team.map((user) => (
                  <span
                    key={user._id}
                    style={{
                      background: "#007bff",
                      color: "#fff",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                    onClick={() => removeTeamMember(user._id)}
                    title="Click to remove"
                  >
                    {user.name} ✕
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <button type="button" onClick={onClose} style={{ padding: "0.4rem 0.8rem" }}>
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: "0.4rem 0.8rem", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}
            >
              {project ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
