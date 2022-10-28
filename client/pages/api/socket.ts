import { Server,Socket } from 'socket.io'
import { nanoid } from 'nanoid'
import EVENTS from '../../config/events'


const lobbys:Record<string,{name:string}> = {}

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on(EVENTS.connection, (socket:Socket) => {

      socket.emit(EVENTS.SERVER.LOBBYS, lobbys)
      
      //user create new Lobby
      socket.on(EVENTS.CLIENT.CREATE_LOBBY,({ lobbyName })=>{
        const lobbyId = nanoid()
        lobbys[lobbyId] = {
          name: lobbyName,
        };

      socket.join(lobbyId);

      // broadcast an EVENTS saying there is a new room
      socket.broadcast.emit(EVENTS.SERVER.LOBBYS, lobbys);

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.LOBBYS, lobbys);

      // emit EVENTS back the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_LOBBY, lobbyId);

      })

      socket.on(EVENTS.CLIENT.JOIN_LOBBY, (roomId) => {
        socket.join(roomId);
  
        socket.emit(EVENTS.SERVER.JOINED_LOBBY, roomId);
      });


      socket.on('input-change', msg => {
        socket.broadcast.emit('update-input', msg)
      })
    })
  }
  res.end()
}

export default SocketHandler