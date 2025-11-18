import express from "express";
import Task from "../models/taskModels.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /api/tasks/pinned - user's pinned tasks
router.get("/pinned", protect, async (req, res) => {
  try {
    const User = (await import("../models/userModel.js")).default;
    const user = await User.findById(req.user._id).populate("pinnedTasks");
    res.json(user?.pinnedTasks || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching pinned tasks" });
  }
});

// GET /api/tasks?projectId=... - tasks for specific project or all user's projects
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectId } = req.query;
    const Project = (await import("../models/projectModel.js")).default;

    if (projectId) {
      const project = await Project.findById(projectId).select(
        "team createdBy"
      );
      if (!project)
        return res.status(404).json({ message: "Project not found" });
      if (!project.team.includes(userId) && !project.createdBy.equals(userId))
        return res.status(403).json({ message: "Forbidden" });

      const tasks = await Task.find({ projectId }).populate({
        path: "assignedTo",
        select: "name",
        strictPopulate: false, // <-- add this
      });
      return res.json(tasks);
    }

    const projects = await Project.find({
      $or: [{ team: userId }, { createdBy: userId }],
    }).select("_id");
    const projectIds = projects.map((p) => p._id);
    const tasks = await Task.find({ projectId: { $in: projectIds } }).populate(
      "assignedTo",
      "name"
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tasks/:id - single task, requires access to project
router.get("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name projectId"
    );
    if (!task) return res.status(404).json({ message: "Task not found" });

    const Project = (await import("../models/projectModel.js")).default;
    const project = await Project.findById(task.projectId).select(
      "team createdBy"
    );
    if (
      !project.team.includes(req.user._id) &&
      !project.createdBy.equals(req.user._id)
    )
      return res.status(403).json({ message: "Forbidden" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks - create task, requires project access
// POST /api/tasks
router.post("/", protect, async (req, res) => {
  try {
    const { projectId, title, description, status, assignedTo } = req.body;
    if (!projectId) return res.status(400).json({ message: "projectId is required" });

    const Project = (await import("../models/projectModel.js")).default;
    const project = await Project.findById(projectId).select("team createdBy");
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!project.team.includes(req.user._id) && !project.createdBy.equals(req.user._id))
      return res.status(403).json({ message: "Forbidden" });

    const task = await new Task({
      title,
      description,
      status,
      assignedTo: assignedTo || [], // <-- store assigned users
      projectId,
      createdBy: req.user._id,
    }).save();

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/tasks/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const Project = (await import("../models/projectModel.js")).default;
    const project = await Project.findById(task.projectId).select("team createdBy");
    if (!project.team.includes(req.user._id) && !project.createdBy.equals(req.user._id))
      return res.status(403).json({ message: "Forbidden" });

    // Update fields including assignedTo
    const { title, description, status, assignedTo } = req.body;
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.assignedTo = assignedTo ?? task.assignedTo;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT / DELETE - update/delete task, requires project access
const modifyTask = async (req, res, action) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const Project = (await import("../models/projectModel.js")).default;
    const project = await Project.findById(task.projectId).select(
      "team createdBy"
    );
    if (
      !project.team.includes(req.user._id) &&
      !project.createdBy.equals(req.user._id)
    )
      return res.status(403).json({ message: "Forbidden" });

    if (action === "update") {
      const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      return res.json(updated);
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(action === "update" ? 400 : 500).json({ error: err.message });
  }
};


router.delete("/:id", protect, async (req, res) =>
  modifyTask(req, res, "delete")
);

export default router;
