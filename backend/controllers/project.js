// backend/controllers/projects.js
import Project from "../models/projectModel.js";

export const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [
        { createdBy: userId },          // projects the user created
        { "team._id": userId },         // projects the user is part of
      ],
    }).populate("team", "name");

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPinnedProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $and: [
        { isPinnedBy: userId },         // only pinned by this user
        {
          $or: [
            { createdBy: userId },
            { "team._id": userId },
          ],
        },
      ],
    }).populate("team", "name");

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
