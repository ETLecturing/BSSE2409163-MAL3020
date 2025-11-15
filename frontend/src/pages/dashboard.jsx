import { useState } from "react";
import ProjectCard from "../components/projectCard";
import KanbanBoard from "../components/kanbanBoard";
import ProjectModal from "../components/addProjectPopup";
import AddButton from "../components/addButton";
import { createProject, fetchProjects, fetchPinnedProjects } from "../api/project";

export default function Dashboard({
  token,
  openProjectTasks,
  allProjects,
  setAllProjects,       // <-- new prop
  pinnedProjects,
  setPinnedProjects,    // <-- new prop
  pinnedTasks,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // handle modal submit
  const handleCreateProject = async ({ name, description }) => {
    try {
      const newProject = await createProject(token, { name, description });

      // refresh sidebar/project lists
      const updatedAll = await fetchProjects(token);
      const updatedPinned = await fetchPinnedProjects(token);
      setAllProjects(updatedAll);
      setPinnedProjects(updatedPinned);

      openProjectTasks(newProject); // open new project Kanban
      setIsModalOpen(false);        // close modal
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <main style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
          {/* Pinned Projects */}
          {pinnedProjects.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <h2>Pinned Projects</h2>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {pinnedProjects.map((proj) => (
                  <ProjectCard
                    key={proj._id}
                    project={proj}
                    onClick={openProjectTasks}
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
                  onClick={openProjectTasks}
                />
              ))}
            </div>
          ) : (
            <p style={{ fontStyle: "italic", color: "#888" }}>
              No projects available
            </p>
          )}

          {/* Add Project Button & Modal */}
          <AddButton onClick={() => setIsModalOpen(true)} />
          <ProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateProject}
          />
        </main>
      </div>
    </div>
  );
}
