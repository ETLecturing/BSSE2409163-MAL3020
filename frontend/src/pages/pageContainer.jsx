import { useState, useEffect } from "react";
import LoginPage from "./login";
import RegisterPage from "./register";
import Dashboard from "./dashboard";
import KanbanBoard from "../components/kanbanBoard";
import DashboardSidebar from "../components/sidebar";
import DashboardNavbar from "../components/navbar";

export default function PageContainer() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null); // use decoded token
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
    loadSidebarData(token)
  }
}, [token]);


  // Fetch projects/tasks for sidebar
  const loadSidebarData = async (token) => {
    const { fetchProjects, fetchPinnedProjects, fetchPinnedTasks } =
      await import("../api/project");
    setAllProjects(await fetchProjects(token));
    setPinnedProjects(await fetchPinnedProjects(token));
    setPinnedTasks(await fetchPinnedTasks(token));
  };

  // Fetch tasks for a project
  const loadProjectTasks = async (projectId) => {
    const { fetchProjectTasks } = await import("../api/project");
    const tasks = await fetchProjectTasks(projectId, token);
    setProjectTasks(tasks);
  };

  const handleLoginSuccess = async (res) => {
    // res = { _id, username, token }
    console.log(res);
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
  localStorage.removeItem("userId"); // match key used in login
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
            <KanbanBoard tasks={projectTasks} />
          </div>
        );
      default:
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {(page === "dashboard" || page === "kanban") && (
        <DashboardNavbar username={username} onLogout={handleLogout} />
      )}

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

      <div style={{ flex: 1, display: "flex", height: "100%" }}>
        {(page === "dashboard" || page === "kanban") && (
          <DashboardSidebar
            allProjects={allProjects}
            pinnedProjects={pinnedProjects}
            pinnedTasks={pinnedTasks}
            onProjectClick={openProjectTasks}
          />
        )}

        <div style={{ flex: 1, overflow: "auto" }}>{renderPage()}</div>
      </div>
    </div>
  );
}
