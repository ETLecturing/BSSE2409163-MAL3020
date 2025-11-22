import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import { setIO } from "./socket.js"; // ADD THIS

dotenv.config();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Register io globally
setIO(io); // ADD THIS

io.on("connection", (socket) => {
  console.log(`WebSocket connected: ${socket.id}`);
  socket.on("joinProject", (projectId) => socket.join(projectId));
  socket.on("taskUpdated", ({ projectId, task }) => socket.to(projectId).emit("taskUpdated", task));
  socket.on("disconnect", () => console.log(`WebSocket disconnected: ${socket.id}`));
});

// MongoDB + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// REMOVE: export { io };