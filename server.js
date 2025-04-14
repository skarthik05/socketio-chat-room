const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server);
// Static Middleware
app.use(express.static(path.join(__dirname, "public")));

const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const botName = "ChatBot";
//Run when cline connects
io.on("connection", (socket) => {
  //Join room
  socket.on("joinRoom", ({ username, room }) => {
    let user = userJoin(socket.id, username, room);

    //seding user to a particular room
    socket.join(user.room);

    //Welecome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatRoom"));

    //Broadcase when a user connects, except the current user
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat`)
      );

    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room,
      users: getRoomUsers(user.room),
    });
  });

  //Listen for chat message
  socket.on("chatMessage", (msg) => {
    let user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Handle typing status
  socket.on("typing", () => {
    const user = getCurrentUser(socket.id);
    if (user) {
      socket.broadcast.to(user.room).emit("userTyping", user.username);
    }
  });

  socket.on("stopTyping", () => {
    const user = getCurrentUser(socket.id);
    if (user) {
      socket.broadcast.to(user.room).emit("userStoppedTyping", user.username);
    }
  });

  //Runs when client disconnects
  socket.on("disconnect", () => {
    let user = userLeave(socket.id);

    if (user) {
      //it will send to all along with the current user
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      //Send users and room infp
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const port = 3000 || process.env.PORT;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
