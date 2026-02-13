
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const express = require("express");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer, {
    path: "/api/socket/io",
    addTrailingSlash: false,
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-chat", (chatId) => {
      console.log(`Socket ${socket.id} joining chat ${chatId}`);
      socket.join(chatId);
    });

    socket.on("send-message", (message) => {
      console.log("Broadcasting message:", message);
      // Broadcast to everyone in the room INCLUDING sender (for optimistic UI updates if needed, but usually redundant)
      // or to everyone EXCEPT sender. Let's do broadcast to room.
      if (message.chatId) {
        socket.to(message.chatId).emit("new-message", message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
