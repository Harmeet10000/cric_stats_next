import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import { globalErrorHandler } from "./middlewares/errorMiddleware.js";
import { authenticateSocket } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3001"], // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3001", // Explicitly set your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true,
  },
});
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/cricket_stats")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);

// Global Error Handler
app.use(globalErrorHandler);

// WebSocket Connection
io.on("connection", (socket) => {
  // Note: changed from "connect" to "connection"
  console.log("New client connected");
  
  io.on("connect", (socket) => {
    console.log("New client connected");

    // Join specific room
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`Client joined room: ${room}`);
    });

    // Handle score updates
    socket.on("updateScore", (updateData) => {
      const room = `${updateData.matchId}-scoreUpdate`;
      io.to(room).emit("scoreUpdate", updateData);
      // console.log("US", updateData);
    });

    // Handle commentary updates
    socket.on("updateCommentary", ({ matchId, comment }) => {
      const room = `${matchId}-comments`;
      io.to(room).emit("commentaryUpdate", comment);
      console.log("CS", comment)
    });

    // Cleanup on disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      // Optionally leave rooms
      socket.rooms.forEach((room) => {
        socket.leave(room);
      });
    });
  });
  // Join specific room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Client joined room: ${room}`);
  });

  // Handle score updates
  socket.on("updateScore", (updateData) => {
    const room = `${updateData.matchId}-scoreUpdate`;
    io.to(room).emit("scoreUpdate", updateData);
    // console.log("US", updateData);
  });

  // Handle commentary updates
  socket.on("updateCommentary", ({ matchId, comment }) => {
    const room = `${matchId}-comments`;
    io.to(room).emit("commentaryUpdate", comment);
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Optionally leave rooms
    socket.rooms.forEach((room) => {
      socket.leave(room);
    });
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
