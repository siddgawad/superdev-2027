import { WebSocketServer,WebSocket } from "ws";


//create a websocketserver 
//intialised web socket server using non native web socket library Websocketserver which we are using because we installed ws 
const wss = new WebSocketServer({port:3003});

// defined an interface User which defines types for data that will be used during joining rooms
interface User{
    socket:WebSocket;
    room:string;
}

let userCount = 0;

type RoomId = string;


// it is a map from websocket to room Id - answers the question which room this socket is in? one socket(user connecting to room) - one room, one socket cannot have multiple rooms at once
const socketToRoom = new Map<WebSocket,RoomId>();
//who is in room R? one room can have many sockets.  set can tell u whether the socket exists, also it stores more than one socket for the room 
const roomToSocket = new Map<RoomId, Set<WebSocket>>();



{/*Step 1 - we ensure set of sockets are registered with a room */}


// we create a function which asks roomToSocket map whether we have any sockets registered with this room
function getRoomSet(roomId:RoomId) : Set<WebSocket>{
    // then we ask if there is a set of sockets for this room exist?
    let set = roomToSocket.get(roomId);
    // if there are nos et of sockets with this roomId
    if(!set){
       // we create an empty set that will hold sockets which join this room
        set = new Set<WebSocket>();
        // then we store these set of sockets are already defined by a room we want to return them
        roomToSocket.set(roomId,set);

    }
    //since these sockets were already defined by a room, we return it as is.
    return set;
}


{/*Step 2 - If a user(socket) wants to join a room*/}



// add a socket to a room
function addSocketToRoom(socket:WebSocket,roomId:RoomId){
    // we call getRoomSet the function above to check if we have any registered sockets with this room Id
    const room = getRoomSet(roomId);
    // any socket that joins gets added to the room
    room.add(socket);

}

{/*Step 3 - If a user wants to exit the room */}


function removeSocketFromRoom(socket:WebSocket,roomId:RoomId){
    const room = roomToSocket.get(roomId);
    if(!room){
        return ;
    }
    room.delete(socket);
}

{/*Step 4 - move a socket from one room to another */}

function moveSocketRoom(socket:WebSocket,oldRoomId:string|undefined,newRoomId:string){
    if(oldRoomId&& oldRoomId!==newRoomId){
        removeSocketFromRoom(socket,oldRoomId);
    }
    addSocketToRoom(socket,newRoomId);
}

{/*Step 5 - a chat arrives for lobby - you grab the set and iterate */}

function brodcastToRoom(roomId:string,textMsg:string,exclude?:WebSocket){
    // we say get room and sockets with this Id 
    const peers = roomToSocket.get(roomId);
    // if room does not exist with this id and set of sockets return
    if(!peers) return;
    //for each socket connected to the room
    for (const peer of peers){
        {/*check their ready state - now readystate can be connecting, open, closing or closed - so when ready state is not open we skip*/}
        if(peer.readyState!==WebSocket.OPEN) continue;
        // here we say if the socket that exists is the same one we are using in the loop, skip
        if(exclude && peer === exclude) continue;
        //when socket in loop is not the same one which has been passed in parameter of function and the readystate is open, we send them the text. and simialrly for all users(sockets in the room).
        peer.send(textMsg);
    }

}



//whenever there is a new connection to the websocket sewrver call a function and give it the socket 
wss.on("connection",(socket)=>{
//socket lets u talk to person who just connected to this socket, and can be used to send messages or recieve messages
//socket servers have no methods, no query paramters 
userCount=userCount+1;
console.log("User connected # "+userCount);









//here server uses socket to receive message
socket.on("message",(message)=>{
  
});










socket.on("disconnect",()=>{

})


})