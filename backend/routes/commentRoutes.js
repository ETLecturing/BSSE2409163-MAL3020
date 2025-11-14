import express from "express";
import Comment from "../models/commentModel.js";

const router = express.Router();

// Get comments by taskId
router.get("/task/:taskId", async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId }).populate("userId", "name");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create comment
router.post("/", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update comment
router.put("/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete comment
router.delete("/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
