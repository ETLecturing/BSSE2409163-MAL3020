import { useEffect, useState } from "react";
import DashboardNavbar from "../components/navbar";
import DashboardSidebar from "../components/sidebar";
import { fetchProjects, fetchPinnedProjects, fetchPinnedTasks } from "../api/project";

function ProjectCard({ project }) {
  return (
    <div style={{
      width: "250px",
      height: "180px",
      border: "1px solid #ccc",
      borderRadius: "12px",
      padding: "1rem",
      margin: "0.5rem",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: "#fff",
      transition: "transform 0.2s ease",
      cursor: "pointer"
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
      <h3 style={{ margin: "0 0 0.5rem 0" }}>{project.name}</h3>
      <p style={{ flex: 1, margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#555" }}>
        {project.description || "No description"}
      </p>
      <p style={{ fontSize: "0.8rem", color: "#777" }}>
        Team: {project.team.map(u => u.name).join(", ")}
      </p>
    </div>
  );
}

export default function Dashboard({ token, onLogout }) {
  const [allProjects, setAllProjects] = useState([]);
  const [pinnedProjects, setPinnedProjects] = useState([]);
  const [pinnedTasks, setPinnedTasks] = useState([]);

  useEffect(() => {
    async function loadData() {
      const projects = await fetchProjects(token);
      const pinnedProjs = await fetchPinnedProjects(token);
      const pinnedTsks = await fetchPinnedTasks(token);
      setAllProjects(projects);
      setPinnedProjects(pinnedProjs);
      setPinnedTasks(pinnedTsks);
    }

    loadData();
  }, [token]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <DashboardNavbar />
      <div style={{ display: "flex", flex: 1 }}>
        <DashboardSidebar
          allProjects={allProjects}
          pinnedProjects={pinnedProjects}
          pinnedTasks={pinnedTasks}
        />

        <main style={{
          flex: 1,
          padding: "1rem",
          display: "flex",
          flexWrap: "wrap",
          overflowY: "auto",
        }}>
          {/* Pinned Projects Section */}
          {pinnedProjects.length > 0 && (
            <div style={{ width: "100%", marginBottom: "1rem" }}>
              <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>Pinned Projects</h2>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {pinnedProjects.map(proj => (
                  <ProjectCard key={proj._id} project={proj} />
                ))}
              </div>
            </div>
          )}

          {/* All Projects Section */}
          {allProjects.length > 0 ? (
            allProjects.map(proj => <ProjectCard key={proj._id} project={proj} />)
          ) : (
            <p style={{ fontStyle: "italic", color: "#888" }}>No projects available</p>
          )}
        </main>
      </div>

      <button onClick={onLogout} style={{
        position: "absolute",
        top: "70px",
        right: "20px",
        padding: "0.5rem 1rem",
        backgroundColor: "#f00",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}>
        Logout
      </button>
    </div>
  );
}
