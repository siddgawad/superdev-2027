import {WebSocketServer} from "ws";

const wss = new WebSocketServer({port:8080});

// event handler
wss.on("connection",function(socket){
    console.log("User connected");
    setInterval(()=>{
        socket.send("Current priccce of solana is "+ Math.random())
    },5000)
    socket.send("hi connected");

    //client handler
    socket.on("message",(e)=>{
        console.log(e.toString());
    })

})