let users = [];
const fs = require("fs");

const SocketServer = (socket) => {
  socket.on("go-online", (id) => {
    if (!users.includes(id)) {
      users.push(id);
    }
    socket.broadcast.emit("add-online-user", id);
  });

  socket.on("logout", (id) => {
    users = users.filter((each) => each != id.toString());
    socket.broadcast.emit("logout", id.toString());
  });

  socket.on("onlineUsers", () => {
    socket.broadcast.emit("onlineUsers", users);
  });
  socket.on("sendMessage", (data) => {
    socket.broadcast.emit("sendMessage", data);
  });

  // seen function
  socket.on("i seen", (data) => {
    socket.broadcast.emit("i-seen-return", data);
  });

  socket.on("new-last-seen-message", (data) =>
    socket.broadcast.emit("new-last-seen-message", data)
  );

  // typing
  socket.on("typing", (data) => socket.broadcast.emit("typing", data));

  // changing photoUrl_other
  socket.on("changePhotoUrl_other", (data) =>
    socket.broadcast.emit("changePhotoUrl_other", data)
  );
};

module.exports = { SocketServer, users };
