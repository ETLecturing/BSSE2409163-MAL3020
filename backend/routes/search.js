import express from "express";
import User from "../models/user.js";

const router = express.Router();

// GET /api/users/search?username=...
router.get("/search", async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ msg: "Username query required" });

  try {
    const regex = new RegExp(username, "i"); // case-insensitive search
    const users = await User.find({ username: regex }).limit(10).select("_id username email");
    res.json(users);
  } catch (err) {
    console.error("User search error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
