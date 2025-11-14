// src/components/ProjectCard.js
export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <p>Team: {project.team.map(u => u.name).join(", ")}</p>
    </div>
  );
}
