import { useState } from "react";
import ProjectCard from "../components/projectCard";
import ProjectModal from "../components/projectModal";
import { createProject, updateProject, deleteProject } from "../api/project";
import { pinProject, unpinProject } from "../api/pinning,jsx";

export default function Dashboard({
  token,
  userId,
  openProjectTasks,
  allProjects,
  setAllProjects,
  pinnedProjects,
  setPinnedProjects,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleSubmit = async ({ name, description, team }) => {
    try {
      if (editingProject) {
        // Update existing project
        const updated = await updateProject(token, editingProject._id, {
          name,
          description,
          team,
        });

        setAllProjects(
          allProjects.map((p) => (p._id === updated._id ? updated : p))
        );
        setPinnedProjects(
          pinnedProjects.map((p) => (p._id === updated._id ? updated : p))
        );
      } else {
        // Create new project
        const newProject = await createProject(token, {
          name,
          description,
          team,
        });
        setAllProjects([newProject, ...allProjects]);
      }

      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    }
  };

  const handleEdit = (project) => {
    if (!project) return;
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (project) => {
    if (!project) return;
    if (!confirm(`Delete project "${project.name}"?`)) return;
    try {
      await deleteProject(token, project._id);
      setAllProjects(allProjects.filter((p) => p._id !== project._id));
      setPinnedProjects(pinnedProjects.filter((p) => p._id !== project._id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  const handlePin = async (project) => {
    if (!userId) {
      alert("User info not loaded yet. Please try again in a moment.");
      return;
    }
    try {
      await pinProject(userId, project._id, token);
      setPinnedProjects([...pinnedProjects, project]);
      setAllProjects(
        allProjects.map((p) =>
          p._id === project._id ? { ...p, isPinned: true } : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to pin project");
    }
  };

  const handleUnpin = async (project) => {
    if (!userId) {
      alert("User info not loaded yet. Please try again in a moment.");
      return;
    }
    try {
      await unpinProject(userId, project._id, token);
      setPinnedProjects(pinnedProjects.filter((p) => p._id !== project._id));
      setAllProjects(
        allProjects.map((p) =>
          p._id === project._id ? { ...p, isPinned: false } : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to unpin project");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <main
          style={{
            flex: 1,
            padding: "1rem",
            overflowY: "auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "flex-start",
          }}
        >
          {allProjects.map((proj) => (
            <ProjectCard
              key={proj._id}
              project={proj}
              pinnedProjects={pinnedProjects}
              onClick={openProjectTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPin={handlePin}
              onUnpin={handleUnpin}
            />
          ))}

          <button
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
            style={{
              width: "250px",
              height: "180px",
              margin: "0.5rem",
              border: "1px dashed #aaa",
              borderRadius: "12px",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            + Add Project
          </button>

          <ProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            project={editingProject}
          />
        </main>
      </div>
    </div>
  );
}
