import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const EVENTS ={
  connection:"connection",
  CLIENT:{
    CREATE_LOBBY:"CREATE_LOBBY",
    JOIN_LOBBY:"JOIN_LOBBY",
    START_GAME:"START_GAME",
  },
  SERVER:{
    LOBBYS:"LOBBYS",
    JOINED_LOBBY:"JOINED_LOBBY",
    ROOM_PLAYER:"ROOM_PLAYER"
  }
}


const lobbys:Record<string,{name:string}> = {}

function socket({ io }: { io: Server }) {
  logger.info(`Sockets enabled`);

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    socket.emit(EVENTS.SERVER.LOBBYS, lobbys);

    /*
     * When a user creates a new room
     */
    socket.on(EVENTS.CLIENT.CREATE_LOBBY, ({ lobbyName,username }) => {
      console.log({ lobbyName });
      // create a roomId
      const lobbyId = nanoid();
      // add a new room to the rooms object
      lobbys[lobbyId] = {
        name: lobbyName,
      };
      socket.join(lobbyId);

      // broadcast an event saying there is a new room
      socket.broadcast.emit(EVENTS.SERVER.LOBBYS, lobbys);

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.LOBBYS, lobbys);
      // emit event back the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_LOBBY, lobbyId);
      socket.to(lobbyId).emit(EVENTS.SERVER.ROOM_PLAYER,({name:username,host:true}))
    });

    socket.on(EVENTS.CLIENT.START_GAME,()=>{})
    /*
     * When a user joins a room
     */
    socket.on(EVENTS.CLIENT.JOIN_LOBBY, ({lobbyId,username}) => {
      socket.join(lobbyId);
      socket.to(lobbyId).emit(EVENTS.SERVER.ROOM_PLAYER,({name:username,host:false}))
      socket.emit(EVENTS.SERVER.JOINED_LOBBY, lobbyId);
    });
    
  });
}

export default socket;