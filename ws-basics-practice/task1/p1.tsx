{/*task - 
    
    Presence Set

Create a Set of “connections” (can just be numbers or dummy objects).

Add 3 items, check .has() on one, delete it, confirm size updates.

Directory Map

Create a Map<userId, connection>.

Add two users, then “send a message” by fetching with .get("user-2").

Delete “user-1” and verify .has("user-1") is false.
    
    */}











import {WebSocketServer} from "ws";
const wss = new WebSocketServer({port:3002});

//create the container once - we use set container- this is a set data structure which we instantiate
const liveSockets = new Set();
//on each new connection use the client socket as callback 
wss.on("connection",(ws)=>{

//here when new client socket is created, we add it to the existing set container
liveSockets.add(ws);
// then we display on conosle how many liveSockets exist in container set currently - we use this after every socket added, or removed, or error
console.log('online:',liveSockets.size);

//when client socket clsoes we clean up
ws.on("close",()=>{
    liveSockets.delete(ws);
    console.log("online:",liveSockets.size);
});

//for error we again cleanup the dead connection 
ws.on("error",()=>{
    liveSockets.delete(ws);
    console.log("online:",liveSockets.size)
});
});




