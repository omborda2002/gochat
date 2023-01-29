import { io } from "socket.io-client";
import React from "react";

export let socket: any = null;

(async () => {
  await fetch("http://localhost:3000/api/socket");
  socket = io();
})();

export const SocketContext = React.createContext(socket);
