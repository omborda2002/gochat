// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "Socket.IO";

interface ClientIF {
  currentUser_id: string;
  socket_id: string;
  roomId: string;
}

let clients: ClientIF[] = [];

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
        await socket.join(data.roomId);
        await socket.broadcast.to(data.roomId).emit("userconnected", data.user);
        addClients(data, socket);
        console.log(`Clients => ${clients.length} => `, clients);
      });

      socket.on("leave-room", async (data) => {
        await socket.leave(data.roomId);
      });

      socket.on("message", async ({ message }) => {
        console.log("Message received", message);
        await socket.broadcast.emit("message", message);
      });

      socket.on("disconnect", async (data: any) => {
        const client_who_disconnect = removeClients(socket.id);

        if (client_who_disconnect) {
          await socket.broadcast
            .to(client_who_disconnect.roomId)
            .emit("userdisconnected", client_who_disconnect);
        }
      });
    });
  }

  res.end();
}

function addClients(data: any, socket: any): void {
  const client_find = clients.find(
    (client) => client.currentUser_id === data.user._id
  );
  if (client_find) {
    // Update Socket ID
    client_find.socket_id = socket.id;
    return;
  }

  // Store Data in Object
  var clientInfo: any = new Object();
  clientInfo.currentUser_id = data.user._id;
  clientInfo.socket_id = socket.id;
  clientInfo.roomId = data.roomId;
  clients.push(clientInfo);
}

function removeClients(id: string) {
  const client_find = clients.find((client) => client.socket_id === id);
  if (client_find) {
    // Remove Client
    clients = clients.filter((client) => client.socket_id !== id);
  }
  return client_find;
}
