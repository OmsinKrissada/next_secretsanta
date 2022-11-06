import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/default";
import EVENTS from "../config/events";

interface Context {
  socket: Socket;
  username?: string;
  setUsername: Function;
  lobbyId?: string;
  lobbys: object;
  players?: { id: string, name: string, isHost: boolean; }[];
  setPlayers: Function;
}

const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
  socket,
  setUsername: () => false,
  lobbys: {},
  setPlayers: () => false,
  players: [],
});

function SocketsProvider(props: any) {
  const [username, setUsername] = useState("");
  const [lobbyId, setLobbyId] = useState("");
  const [lobbys, setLobbys] = useState({});
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    window.onfocus = function () {
      document.title = "Secret Santa";
    };
  }, []);

  socket.on(EVENTS.SERVER.LOBBYS, (value) => {
    setLobbys(value);
  });

  socket.on(EVENTS.SERVER.JOINED_LOBBY, ({ id, players }) => {
    setLobbyId(id);
    setPlayers(players);
  });

  useEffect(() => {
    socket.on(EVENTS.SERVER.ROOM_PLAYER, (players) => {
      if (!document.hasFocus()) {
        document.title = "Joining...";
      }

      setPlayers(players);
    });
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        username,
        setUsername,
        lobbys,
        lobbyId,
        players,
        setPlayers,
      }}
      {...props}
    />
  );
}

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;