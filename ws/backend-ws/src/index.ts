import {WebSocketServer} from "ws";

const wss = new WebSocketServer({port:3000});

// event handler
wss.on("connection",function(socket){
    console.log("User connected");

    //client handler
    socket.on("message",(e)=>{
        const msg = e.toString();
            socket.send(msg);
        
    })

})