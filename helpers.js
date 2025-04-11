import { wake } from "wake_on_lan";
import ping from "ping";

export const getAllServerStatuses = async (servers) => {
  for (let i = 0; i < servers.length; i++) {
    const online = await isOnline(servers[i].ip);
    servers[i].name =
      servers[i].name.charAt(0).toUpperCase() + servers[i].name.slice(1);
    servers[i].mac = servers[i].mac.toUpperCase();
    servers[i].isOnline = online;
  }
  return servers.sort((a, b) => a.name.localeCompare(b.name));
};

export const isOnline = async (ip) => {
  const system = await ping.promise.probe(ip, { timeout: 1 });
  return system.alive;
};

export const checkWOLStatus = async (server) => {
  const max_tries = 30;
  try {
    console.log("Sending WOL packets...");
    wake(server.mac, { address: server.broadcast });

    await new Promise((resolve) => setTimeout(resolve, 5_000));

    for (let i = 0; i < max_tries; i++) {
      const online = await isOnline(server.ip);
      if (online) {
        const timestamp = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
        console.log(`${timestamp} - ${server.name} started`);
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 1_000));
    }
    console.log(`${server.name} is not online!`);
    return false;
  } catch (error) {
    console.error("Error during WoL process:", error);
    return false;
  }
};
