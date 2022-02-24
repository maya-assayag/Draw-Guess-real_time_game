const winston = require("winston");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);

const port = process.env.PORT || 3900;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  //console.log(`User connected ${socket.id}`);
  socket.join("session");

  socket.on("player1_start_game", session => {
    socket.broadcast.emit("waiting_to_player2");
  });

  socket.on("player2_join_game", () => {
    socket.broadcast.emit("player2_join_game");
  });

  socket.on("player1_choosed_word", word => {
    socket.broadcast.emit("player1_choosed_word");
    socket.broadcast.emit("send_word_to_gussing_view", word);
  });

  socket.on("send_canvas_elements", elements => {
    socket.broadcast.emit("recive_canvas_elements", elements);
  });

  socket.on("round_over", () => {
    socket.broadcast.emit("round_over");
  });

  socket.on("session_over", () => {
    socket.broadcast.emit("session_over");
  });

  //socket.on("disconnect", () => {});
});

module.exports = server;
