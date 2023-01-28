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
      // socket.on("input-change", (msg) => {
      //   socket.broadcast.emit("update-input", msg);
      // });
      // socket.join("room", () => {
      //   console.log("Joined room");
      // });
      socket.on("join-room", (room) => {
        socket.join(room);
        console.log("Joined room", room);
      });

      socket.on("message", ({ message }) => {
        console.log("Message received", message);
        socket.broadcast.emit("message", message);
      });
    });
  }

  res.end();
}
