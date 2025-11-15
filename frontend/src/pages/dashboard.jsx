import { useState } from "react";
import ProjectCard from "../components/projectCard";
import ProjectModal from "../components/addProjectPopup";
import { createProject, updateProject, deleteProject } from "../api/project";

export default function Dashboard({
  token,
  openProjectTasks,
  allProjects,
  setAllProjects,
  pinnedProjects,
  setPinnedProjects,
  pinnedTasks,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null = create, object = edit

  const handleSubmit = async ({ name, description }) => {
    try {
      if (editingProject) {
        // Update existing
        const updated = await updateProject(token, editingProject._id, { name, description });
        setAllProjects(allProjects.map(p => (p._id === updated._id ? updated : p)));
        setPinnedProjects(pinnedProjects.map(p => (p._id === updated._id ? updated : p)));
      } else {
        // Create new
        const newProject = await createProject(token, { name, description });
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
      setAllProjects(allProjects.filter(p => p._id !== project._id));
      setPinnedProjects(pinnedProjects.filter(p => p._id !== project._id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
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
    flexWrap: "wrap",       // allow items to wrap to next line
    gap: "1rem",            // spacing between cards
    justifyContent: "flex-start", // align cards from left
  }}
>
  {allProjects.length > 0 && allProjects.map(proj => (
    <ProjectCard
      key={proj._id}
      project={proj}
      onClick={openProjectTasks}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ))}

  <button
    onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
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
