import { WebSocketServer,WebSocket, type RawData } from "ws";

//create a websocketserver 
//intialised web socket server using non native web socket library Websocketserver which we are using because we installed ws 
const wss = new WebSocketServer({port:3003});

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
        console.log(`Created new room: ${roomId}`);
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
    // update the socket to room mapping
    socketToRoom.set(socket, roomId);
    console.log(`Socket added to room: ${roomId}. Room now has ${room.size} sockets`);
}

{/*Step 3 - If a user wants to exit the room */}



function removeSocketFromRoom(socket:WebSocket,roomId:RoomId){
    const room = roomToSocket.get(roomId);
    if(!room){
        console.log(`Attempted to remove socket from non-existent room: ${roomId}`);
        return ;
    }
    room.delete(socket);
    console.log(`Socket removed from room: ${roomId}. Room now has ${room.size} sockets`);
}

{/*Step 4 - move a socket from one room to another */}

function moveSocketRoom(socket:WebSocket,oldRoomId:string|undefined,newRoomId:string){
    console.log(`Moving socket from room: ${oldRoomId} to room: ${newRoomId}`);
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
    if(!peers) {
        console.log(`Attempted to broadcast to non-existent room: ${roomId}`);
        return;
    }
    
    console.log(`Broadcasting message to room: ${roomId} with ${peers.size} peers`);
    let sentCount = 0;
    
    //for each socket connected to the room
    for (const peer of peers){
        {/*check their ready state - now readystate can be connecting, open, closing or closed - so when ready state is not open we skip*/}
        if(peer.readyState!==WebSocket.OPEN) {
            console.log(`Skipping peer with readyState: ${peer.readyState}`);
            continue;
        }
        // here we say if the socket that exists is the same one we are using in the loop, skip
        if(exclude && peer === exclude) {
            console.log(`Excluding sender from broadcast`);
            continue;
        }
        //when socket in loop is not the same one which has been passed in parameter of function and the readystate is open, we send them the text. and simialrly for all users(sockets in the room).
        peer.send(textMsg);
        sentCount++;
    }
    console.log(`Message sent to ${sentCount} peers in room: ${roomId}`);
}
{/*Part 6 - we now define the types for our messages */}
 


type JoinMsg = {type:"join";payload:{roomId:RoomId}};
type ChatMsg = {type:"chat",payload:{roomId:RoomId;message:string}};
type ClientMsg = JoinMsg | ChatMsg;

//we recieve messages in the browser, in form of rawData from sockets due to ws library 
//it is of 3 types
type rawData = Buffer | ArrayBuffer | Buffer[];

{/*Part 7 - We now define function that converts raw bytes to UTF-8 string */}

function rawToUtf8(data:RawData):string{
    if (Array.isArray(data))
        data = Buffer.concat(data);
    const buff = Buffer.isBuffer(data)? data : Buffer.from(data as ArrayBuffer);
    return buff.toString("utf-8");
}


{/*Part 8 - define a function which takes the data (string converted) and parses it into JSON, and then returns the object after ensuring type checks(type ClientMSg defined above) */}


function parseClientMsg(text:string):ClientMsg|null{
    try{
        const obj = JSON.parse(text);

        if(obj.type==="join" && typeof obj.payload.roomId === "string" && obj.payload.roomId.length>0){
            console.log(`Parsed join message for room: ${obj.payload.roomId}`);
            return{
                type:"join",payload:{roomId:obj.payload.roomId}
            }
        }
        // Fixed the condition check - should check if obj.payload.roomId is a string, not if it equals the string "string"
        if(obj.type==="chat" && typeof obj.payload.roomId === "string" && obj.payload.roomId.length>0
             && typeof obj.payload.message==="string" && obj.payload.message.length>0){

                console.log(`Parsed chat message for room: ${obj.payload.roomId}, message: ${obj.payload.message}`);
                return{
                    type:"chat",
                    payload:{
                        roomId:obj.payload.roomId,
                        message:obj.payload.message  // Fixed typo: was obj.paylaod.message
                    }
                }
        }
        console.log("Message failed validation checks:", obj);
        return null;
    }catch(error){
        console.log("Failed to Parse JSON:", error);
        return null;
    }
}

{/*Part 9 - for cleanup i.e for sockets which leave the rooma dn do not exist we write clenaup function */}

function cleanup(socket:WebSocket){
    //we get the room ID by socket to roomId connection 
    const roomId = socketToRoom.get(socket);
    console.log(`Cleaning up socket from room: ${roomId}`);
    //first we delete the record for this specific socket and room connection map 
    socketToRoom.delete(socket);
    if(roomId) removeSocketFromRoom(socket,roomId);
}

//whenever there is a new connection to the websocket sewrver call a function and give it the socket 
wss.on("connection",(socket:WebSocket)=>{
    console.log("New WebSocket connection established");

//here server uses socket to receive message
socket.on("message",(message:RawData,isBinary:boolean)=>{
  // convert data first 
  const data = rawToUtf8(message).trim();
  console.log(`Received raw message: ${data}`);
  if(!data) return;

  //convert string into typed union 
  const msg = parseClientMsg(data);
  if(!msg) return;

  // act by discriminated union
  if(msg.type==="join"){
    const current = socketToRoom.get(socket);
    moveSocketRoom(socket,current,msg.payload.roomId);
    return;
  }

  if(msg.type==="chat"){
    const {roomId,message} = msg.payload;
    const currentRoom = socketToRoom.get(socket);
    console.log(`Chat message received. Socket is in room: ${currentRoom}, message for room: ${roomId}`);
    
    if(currentRoom !== roomId) {
        console.log(`Socket not in correct room. Current: ${currentRoom}, Required: ${roomId}`);
        return;
    }
    if(message.length>8*1024) {
        console.log("Message too long, rejected");
        return;
    }
    brodcastToRoom(roomId,message,socket); // Added 'socket' parameter to exclude sender
    return;
  }

});

socket.on("close",()=>{
    console.log("Socket closed");
    cleanup(socket);
});

socket.on("error",(error)=>{
    console.log("Socket error:", error);
    cleanup(socket);
});

})