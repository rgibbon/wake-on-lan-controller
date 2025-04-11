import OnlineButton from "../assets/check-green.svg";
import PowerButton from "../assets/power-red.svg";
import LoadingSpinner from "./LoadingSpinner";
import { useState, useEffect } from "react";
import { socket } from "../socket.js";

export default function ({ server, isOnline }) {
  const [loading, setLoading] = useState(false);
  const { name, ip, mac } = server;

  const handleStart = async () => {
    if (isOnline) return;
    setLoading(true);
    socket.emit("start-server", server);
  };

  function handleUpdate({ name: _name }) {
    if (_name !== name) return;
    setLoading(false);
  }

  useEffect(() => {
    socket.on("update", handleUpdate);
    return () => {
      socket.off("update", handleUpdate);
    };
  }, []);

  const loadingStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "165px",
  };

  if (loading) return LoadingSpinner(loadingStyle);
  return (
    <li
      className={isOnline ? "server" : "server offline"}
      onClick={handleStart}
    >
      <img
        src={isOnline ? OnlineButton : PowerButton}
        alt="Power button"
        width="80px"
      />
      <div className="server-details">
        <h2 className="server-name">{name}</h2>
        <h4 style={{ color: isOnline ? "green" : "red" }}>
          {isOnline ? "ONLINE" : "OFFLINE"}
        </h4>
        <h4>IP address {ip}</h4>
        <h4>MAC address {mac}</h4>
      </div>
    </li>
  );
}
