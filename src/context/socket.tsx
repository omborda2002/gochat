import { io } from "socket.io-client";
import React from "react";

export let socket: any = null;

(async () => {
  await fetch("/api/socket");
  socket = io();
})();

export const SocketContext = React.createContext(socket);
