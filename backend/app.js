import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);

// Serve static files in production (only if client_build exists)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, "client_build")));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "client_build", "index.html"));
  });


export default app;