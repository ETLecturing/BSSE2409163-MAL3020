import express from "express";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "Username taken" });

    const user = await User.create({ name, username, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
