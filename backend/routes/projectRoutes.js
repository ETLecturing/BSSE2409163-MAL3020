import express from "express";
import Project from "../models/projectModel.js";
import { protect } from "../middleware/auth.js";
import { checkProjectAccess } from "../middleware/authorize.js";
import { io } from "../socket.js";

const router = express.Router();

// GET /api/projects - projects user is part of or created
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ team: req.user._id }, { createdBy: req.user._id }],
    }).populate("team", "name");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/pinned - user's pinned projects
router.get("/pinned", protect, async (req, res) => {
  try {
    const User = (await import("../models/userModel.js")).default;
    const user = await User.findById(req.user._id).populate("pinnedProjects");
    res.json(user?.pinnedProjects || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching pinned projects" });
  }
});

// GET /api/projects/:id - project detail (requires access)
router.get("/:id", protect, checkProjectAccess, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("team", "name");
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects - create project (creator auto-added to team)
router.post("/", protect, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user._id,
      team: req.body.team ? [...new Set([...req.body.team, req.user._id])] : [req.user._id],
    };
    const project = await new Project(payload).save();
    res.status(201).json(project);
    io.emit("REFRESH_PROJECT");

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/projects/:id - update project (requires access)
router.put("/:id", protect, checkProjectAccess, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.createdBy;

    const project = await Project.findByIdAndUpdate(req.params.id, updates, { new: true }).populate("team", "name");
    res.json(project);
    io.emit("REFRESH_PROJECT");

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/projects/:id - only creator can delete
router.delete("/:id", protect, checkProjectAccess, async (req, res) => {
  try {
    if (!req.project.createdBy.equals(req.user._id))
      return res.status(403).json({ message: "Only project creator can delete this project" });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
    io.emit("REFRESH_PROJECT");

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id/tasks - tasks for project (requires access)
router.get("/:id/tasks", protect, checkProjectAccess, async (req, res) => {
  try {
    const Task = (await import("../models/taskModels.js")).default;
    const tasks = await Task.find({ projectId: req.params.id }).populate("assignedTo", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
