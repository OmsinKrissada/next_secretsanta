import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_LOBBY: "CREATE_LOBBY",
    JOIN_LOBBY: "JOIN_LOBBY",
    START_GAME: "START_GAME",
  },
  SERVER: {
    LOBBYS: "LOBBYS",
    JOINED_LOBBY: "JOINED_LOBBY",
    ROOM_PLAYER: "ROOM_PLAYER"
  }
};


const lobbys = new Map<string, { name: string; players: { id: string, name: string, isHost: boolean; }[]; }>();

function socket({ io }: { io: Server; }) {
  logger.info(`Sockets enabled`);

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    socket.emit(EVENTS.SERVER.LOBBYS, lobbys);

    /*
     * When a user creates a new room
     */
    socket.on(EVENTS.CLIENT.CREATE_LOBBY, ({ lobbyName, username }) => {
      console.log({ lobbyName });
      // create a roomId
      const lobbyId = nanoid();
      // add a new room to the rooms object
      lobbys.set(lobbyId, {
        name: lobbyName,
        players: []
      });

      const lobby = lobbys.get(lobbyId);
      // socket.join(lobbyId);

      console.log(`lobby created: ID: ${lobbyId}, Name: ${lobbyName}`);

      lobby!.players.push({ id: socket.id, name: username, isHost: true });

      // broadcast an event saying there is a new room
      // socket.broadcast.emit(EVENTS.SERVER.LOBBYS, lobbys); // (disabled for security reasons)

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.LOBBYS, lobbys);
      // emit event back the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_LOBBY, { lobbyId: lobbyId, players: lobby!.players });
      // socket.to(lobbyId).emit(EVENTS.SERVER.ROOM_PLAYER, lobby!.players); // will reach no one
    });

    socket.on(EVENTS.CLIENT.START_GAME, () => { });
    /*
     * When a user joins a room
     */
    socket.on(EVENTS.CLIENT.JOIN_LOBBY, async ({ lobbyId, username }) => {
      console.log(`User trying to join (${username} -> ${lobbyId}), Available (${lobbys.size}): ${JSON.stringify(lobbys)}`);
      const lobby = lobbys.get(lobbyId);
      if (!lobby) {
        socket.emit('LOBBY_NOT_FOUND', lobbyId);
        return;
      }
      // io.sockets.adapter.rooms[]
      await socket.join(lobbyId);
      if (!lobby.players.find(p => p.id == socket.id))
        lobby.players.push({ id: socket.id, name: username, isHost: false });
      socket.emit(EVENTS.SERVER.JOINED_LOBBY, { lobbyId, players: lobby.players });
      socket.to(lobbyId).emit(EVENTS.SERVER.ROOM_PLAYER, lobby.players);
      console.log('Join approved.');
    });

  });
}

export default socket;