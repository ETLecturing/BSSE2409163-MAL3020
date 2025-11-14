// middleware/authorize.js
import Project from "../models/projectModel.js";

export const checkProjectAccess = async (req, res, next) => {
  const userId = req.user && req.user._id;
  const projectId = req.params.id || req.body.projectId || req.query.projectId;

  if (!projectId) {
    return res.status(400).json({ message: "project id required for this operation" });
  }

  try {
    const project = await Project.findById(projectId).select("team createdBy");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.team.some((m) => m.equals(userId));
    const isCreator = project.createdBy && project.createdBy.equals(userId);

    if (!isMember && !isCreator) {
      return res.status(403).json({ message: "Forbidden: you are not a member of this project" });
    }

    // attach project to request for downstream handlers if needed
    req.project = project;
    next();
  } catch (err) {
    console.error("checkProjectAccess error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
