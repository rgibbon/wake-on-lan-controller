import LoadingSpinner from "./components/LoadingSpinner";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import Server from "./components/Server";
import { socket } from "./socket";
import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [servers, setServers] = useState([]);

  function getInitialData({ servers, title }) {
    document.title = title;
    setServers(servers);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1_250);
    return () => clearTimeout(timer);
  }
  function handleChange(servers) {
    setServers(servers);
  }

  useEffect(() => {
    socket.once("initial-data", getInitialData);
    socket.on("change", handleChange);
    return () => {
      socket.off("initial-data", getInitialData);
      socket.off("change", handleChange);
    };
  }, []);

  if (loading)
    return (
      <div className="window">
        <div className="loading-window">{LoadingSpinner()}</div>
      </div>
    );

  return (
    <div className="window">
      <ul className="dashboard">
        {servers.map((server) => (
          <Server
            key={server.name}
            isOnline={server.isOnline}
            server={server}
          />
        ))}
      </ul>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
