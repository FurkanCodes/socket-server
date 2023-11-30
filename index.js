const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://socket-client-n6ed.onrender.com/",
    methods: ["GET", "POST"],
  },
});

server.listen(3001, () => {
  console.log("server is running");
});
let connectedUsers = 0;

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  connectedUsers++;
  io.emit("user count", connectedUsers);

  socket.on("pokemon selection", (pokemon) => {
    console.log(`User ${socket.id} selected ${pokemon}`);
    socket.broadcast.emit("pokemon selection", {
      id: socket.id,
      pokemon: pokemon,
    });
    // Handle the selection, e.g., store it, or emit an update to other users
  });

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("disconnect", () => {
    connectedUsers--;
    io.emit("user count", connectedUsers);
  });
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});
