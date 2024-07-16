import config from "config";
import { createServer } from "http";
import { Server } from "socket.io";

const wsServer = createServer();
const io = new Server(wsServer, {
  cors: { origin: config.get("client.clientURL") },
});

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    const roomId = `Tenant-${data.tenantId}`;
    socket.join(roomId);
    socket.emit("joined", roomId);
  });
});

export default {
  wsServer,
  io,
};
