require("dotenv").config();

const { app } = require("../app");

const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 5000;
const io = require("socket.io")(server, {
  cors: {
    origin: `${process.env.BASE_URL}`,
    credentials: true,
  },
});
const { SocketServer } = require("../socketServer");

server.listen(port, () => {
  console.log("server is running on port ", port);
});

io.on("connection", (socket) => {
  SocketServer(socket);
});
