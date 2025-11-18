import { useState, useEffect } from "react";
import LoginPage from "./login";
import RegisterPage from "./register";
import Dashboard from "./dashboard";
import KanbanBoard from "./kanbanBoard";
import DashboardSidebar from "../components/sidebar";
import DashboardNavbar from "../components/navbar";

export default function PageContainer() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [pinnedProjects, setPinnedProjects] = useState([]);
  const [pinnedTasks, setPinnedTasks] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    if (token && userId && username) {
      setToken(token);
      setUserId(userId);
      setUsername(username);
      setPage("dashboard");
      loadSidebarData(token);
    }

    if (token) {
      loadSidebarData(token);
    }
  }, [token]);

  const loadSidebarData = async (token) => {
    const { fetchProjects, fetchPinnedProjects, fetchPinnedTasks } =
      await import("../api/project");
    setAllProjects(await fetchProjects(token));
    setPinnedProjects(await fetchPinnedProjects(token));
    setPinnedTasks(await fetchPinnedTasks(token));
  };

  const loadProjectTasks = async (projectId) => {
    const { fetchProjectTasks } = await import("../api/project");
    const tasks = await fetchProjectTasks(projectId, token);
    setProjectTasks(tasks);
  };

  const handleLoginSuccess = async (res) => {
    const { _id, username, token } = res;
    setToken(token);
    setUsername(username);
    setUserId(_id);
    await loadSidebarData(token);
    setPage("dashboard");
  };

  const handleRegisterSuccess = () => setPage("login");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setToken(null);
    setUsername("");
    setUserId(null);
    setPage("login");
    setActiveProject(null);
    setProjectTasks([]);
  };

  const openProjectTasks = async (project) => {
    if (!project) {
      setActiveProject(null);
      setProjectTasks([]);
      setPage("dashboard");
      return;
    }

    setActiveProject(null);
    setProjectTasks([]);
    setPage("dashboard");

    setTimeout(async () => {
      setActiveProject(project);
      await loadProjectTasks(project._id);
      setPage("kanban");
    }, 50);
  };

  const handleAddProject = async () => {
    const { createProject } = await import("../api/project");
    const newProject = await createProject(token, {
      name: "New Project",
      description: "",
      team: [],
    });
    loadSidebarData(token);
    openProjectTasks(newProject);
  };

  const renderPage = () => {
    switch (page) {
      case "login":
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case "register":
        return <RegisterPage onRegisterSuccess={handleRegisterSuccess} />;
      case "dashboard":
        return (
          <Dashboard
            token={token}
            userId={userId}
            openProjectTasks={openProjectTasks}
            allProjects={allProjects}
            setAllProjects={setAllProjects}
            pinnedProjects={pinnedProjects}
            setPinnedProjects={setPinnedProjects}
            pinnedTasks={pinnedTasks}
          />
        );
      case "kanban":
        return (
          <div style={{ padding: "1rem" }}>
            <button
              onClick={() => openProjectTasks(null)}
              style={{ marginBottom: "1rem" }}
            >
              ← Back to Dashboard
            </button>
            <h2>{activeProject?.name}</h2>
            <KanbanBoard
              projectId={activeProject?._id}
              token={token}
              team={activeProject?.team || []}
            />
          </div>
        );
      default:
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f5f6fa" }}>
      {/* Navbar / Dashboard */}
      {(page === "dashboard" || page === "kanban") && (
        <DashboardNavbar
          username={username}
          onLogout={handleLogout}
          style={{
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // subtle update
          }}
        />
      )}

      {/* Login/Register Header */}
      {page !== "dashboard" && page !== "kanban" && (
        <header
          style={{
            padding: "1.5rem 2rem",
            textAlign: "center",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h1
            style={{
              margin: "0 0 1rem 0",
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "#333",
            }}
          >
            Project Management System
          </h1>
          <nav style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
            <button
              onClick={() => setPage("login")}
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                backgroundColor: page === "login" ? "#1e90ff" : "#e0e0e0",
                color: page === "login" ? "#fff" : "#333",
                transition: "0.2s",
              }}
            >
              Login
            </button>
            <button
              onClick={() => setPage("register")}
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                backgroundColor: page === "register" ? "#28a745" : "#e0e0e0",
                color: page === "register" ? "#fff" : "#333",
                transition: "0.2s",
              }}
            >
              Register
            </button>
          </nav>
        </header>
      )}

      <div style={{ flex: 1, display: "flex", height: "100%" }}>
        {(page === "dashboard" || page === "kanban") && (
          <DashboardSidebar
            allProjects={allProjects}
            pinnedProjects={pinnedProjects}
            pinnedTasks={pinnedTasks}
            onProjectClick={openProjectTasks}
          />
        )}

        {/* Page content */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {renderPage()}
        </div>
      </div>

      {/* Footer */}
      {page !== "dashboard" && page !== "kanban" && (
        <footer
          style={{
            textAlign: "center",
            padding: "0.75rem 0",
            fontSize: "0.85rem",
            color: "#aaa",
          }}
        >
          BSSE2409163
        </footer>
      )}
    </div>
  );
}
