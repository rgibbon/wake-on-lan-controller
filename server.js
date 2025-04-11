import { checkWOLStatus, getAllServerStatuses, isOnline } from "./helpers.js";
import { parse as yamlParse } from "yaml";
import { Server } from "socket.io";
import { readFileSync } from "fs";
import express from "express";
import { join } from "path";
import http from "http";

const app = express();
const public_folder = join(import.meta.dirname, "public");

app.use(express.static(public_folder));
app.use(express.json());

const configFile = readFileSync("servers.yml", { encoding: "utf8" });
const parsedConfig = yamlParse(configFile);
const parsedServers = parsedConfig.servers;
const client_title = parsedConfig.title || "WOL Controller";
const polling_rate = parsedConfig.polling_rate;
let servers = await getAllServerStatuses(parsedServers);

app.get("/", async (req, res) => {
  res.sendFile(join(public_folder, "index.html"));
});

// WEB SOCKET

const socket = http.createServer(app);
const io = new Server(socket, { cors: { origin: "http://localhost:3000" } });

socket.listen(1024, () => {
  console.log("SOCKET listening on 1024");
});

io.on("connection", (socket) => {
  socket.emit("initial-data", { servers, title: client_title });

  setInterval(async () => {
    const refreshedServerList = await getAllServerStatuses(parsedServers);
    socket.emit("change", refreshedServerList);
  }, polling_rate);

  socket.on("start-server", async (server) => {
    await checkWOLStatus(server);
    // const servers = await getAllServerStatuses(parsedServers);
    socket.emit("update", { name: server.name });
  });
});
