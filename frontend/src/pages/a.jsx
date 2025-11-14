import { useState, useEffect } from "react";
import { fetchProjects, fetchPinnedProjects, fetchProjectTasks, fetchPinnedTasks } from "../api/project";
import ProjectCard from "../components/projectCard";
import KanbanBoard from "../components/kanbanBoard";
import DashboardNavbar from "../components/navbar";
import DashboardSidebar from "../components/sidebar";

export default function Dashboard({ token, onLogout, activeProjectId, openProjectTasks }) {
  const [allProjects, setAllProjects] = useState([]);
  const [pinnedProjects, setPinnedProjects] = useState([]);
  const [pinnedTasks, setPinnedTasks] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);

  // Load projects + pinned projects + pinned tasks
  useEffect(() => {
    async function loadData() {
      setAllProjects(await fetchProjects(token));
      setPinnedProjects(await fetchPinnedProjects(token));
      setPinnedTasks(await fetchPinnedTasks(token));
    }
    loadData();
  }, [token]);

  // Load tasks for the active project
  useEffect(() => {
    if (!activeProjectId) return;
    async function loadTasks() {
      setProjectTasks(await fetchProjectTasks(activeProjectId, token));
    }
    loadTasks();
  }, [activeProjectId, token]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Navbar on top */}
      <DashboardNavbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <DashboardSidebar
          allProjects={allProjects}
          pinnedProjects={pinnedProjects}
          pinnedTasks={pinnedTasks}
        />

        {/* Main content */}
        <main style={{ flex: 1, padding: "1rem", overflowY: "auto", position: "relative" }}>
          {activeProjectId ? (
            <div>
              <button
                onClick={() => openProjectTasks(null)}
                style={{ marginBottom: "1rem" }}
              >
                ← Back to Dashboard
              </button>
              <KanbanBoard tasks={projectTasks} />
            </div>
          ) : (
            <>
              {/* Pinned Projects */}
              {pinnedProjects.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <h2>Pinned Projects</h2>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {pinnedProjects.map((proj) => (
                      <ProjectCard
                        key={proj._id}
                        project={proj}
                        onClick={() => openProjectTasks(proj._id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Projects */}
              {allProjects.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {allProjects.map((proj) => (
                    <ProjectCard
                      key={proj._id}
                      project={proj}
                      onClick={() => openProjectTasks(proj._id)}
                    />
                  ))}
                </div>
              ) : (
                <p style={{ fontStyle: "italic", color: "#888" }}>No projects available</p>
              )}

              {/* Logout button */}
              <button
                onClick={onLogout}
                style={{
                  position: "absolute",
                  top: "70px",
                  right: "20px",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#f00",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
