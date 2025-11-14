import { useState, useEffect } from "react";
import LoginPage from "./login";
import RegisterPage from "./register";
import Dashboard from "./dashboard";
import KanbanBoard from "../components/kanbanBoard";
import DashboardSidebar from "../components/sidebar";
import DashboardNavbar from "../components/navbar"; // consistent navbar

export default function PageContainer() {
  const [page, setPage] = useState("login"); // "login" | "register" | "dashboard" | "kanban"
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [activeProject, setActiveProject] = useState(null); // object with id + name
  const [allProjects, setAllProjects] = useState([]);
  const [pinnedProjects, setPinnedProjects] = useState([]);
  const [pinnedTasks, setPinnedTasks] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);

  // load saved token + username
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("username");
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) setUsername(savedUser);
      setPage("dashboard");
      loadSidebarData(savedToken);
    }
  }, []);

  // fetch projects/tasks for sidebar
  const loadSidebarData = async (token) => {
    const { fetchProjects, fetchPinnedProjects, fetchPinnedTasks } = await import("../api/project");
    setAllProjects(await fetchProjects(token));
    setPinnedProjects(await fetchPinnedProjects(token));
    setPinnedTasks(await fetchPinnedTasks(token));
  };

  // fetch tasks for a project
  const loadProjectTasks = async (projectId) => {
    const { fetchProjectTasks } = await import("../api/project");
    const tasks = await fetchProjectTasks(projectId, token);
    setProjectTasks(tasks);
  };

  // login
  const handleLoginSuccess = (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setToken(token);
    setUsername(username);
    setPage("dashboard");
    loadSidebarData(token);
  };

  // register
  const handleRegisterSuccess = () => setPage("login");

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername("");
    setPage("login");
    setActiveProject(null);
    setProjectTasks([]);
  };

  // open Kanban for project
  const openProjectTasks = async (project) => {
    if (!project) {
      setActiveProject(null);
      setProjectTasks([]);
      setPage("dashboard");
      return;
    }
    setActiveProject(project);
    await loadProjectTasks(project._id);
    setPage("kanban");
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
            openProjectTasks={openProjectTasks}
            allProjects={allProjects}
            pinnedProjects={pinnedProjects}
            pinnedTasks={pinnedTasks}
          />
        );
      case "kanban":
        return (
          <div style={{ padding: "1rem" }}>
            <button onClick={() => openProjectTasks(null)} style={{ marginBottom: "1rem" }}>
              ← Back to Dashboard
            </button>
            <h2>{activeProject?.name}</h2>
            <KanbanBoard tasks={projectTasks} />
          </div>
        );
      default:
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar only on dashboard or kanban */}
      {(page === "dashboard" || page === "kanban") && (
  <DashboardSidebar
    allProjects={allProjects}
    pinnedProjects={pinnedProjects}
    pinnedTasks={pinnedTasks}
    onProjectClick={openProjectTasks} // sidebar click triggers Kanban
  />
)}


      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Navbar always visible when logged in */}
        {(page === "dashboard" || page === "kanban") && (
          <DashboardNavbar username={username} onLogout={handleLogout} />
        )}

        {/* Login/Register navigation */}
        {page !== "dashboard" && page !== "kanban" && (
          <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
            <button
              onClick={() => setPage("login")}
              className={page === "login" ? "active" : ""}
              style={{ marginRight: "1rem" }}
            >
              Login
            </button>
            <button
              onClick={() => setPage("register")}
              className={page === "register" ? "active" : ""}
            >
              Register
            </button>
          </nav>
        )}

        <div style={{ flex: 1, overflow: "auto" }}>{renderPage()}</div>
      </div>
    </div>
  );
}
