// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "Socket.IO";

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (res?.socket?.server?.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res?.socket?.server);
    res?.socket?.server?.io = io;
  }
  res.end();
}
