import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:1024";

export const socket = io(URL);
