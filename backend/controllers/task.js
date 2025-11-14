// backend/controllers/tasks.js
import Task from "../models/taskModels.js";

export const getPinnedTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({
      isPinnedBy: userId,
    }).populate("assignedTo", "name");

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
