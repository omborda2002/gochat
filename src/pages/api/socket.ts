// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "Socket.IO";

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Socket connected", socket.id);

      socket.on("join-room", async (data: any) => {
        console.log("Joining room :::: ", data);
        await socket.join(data.roomId);
        await socket.broadcast
          .to(data.roomId)
          .emit("userconnected", data.user);
      });

      socket.on("leave-room", async (data) => {
        await socket.leave(data.roomId);
        console.log("Left room => ", data.roomId);
      });

      socket.on("message", async ({ message }) => {
        console.log("Message received", message);
        await socket.broadcast.emit("message", message);
      });
    });
  }

  res.end();
}
