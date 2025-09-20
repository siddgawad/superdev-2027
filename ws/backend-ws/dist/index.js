import { WebSocketServer, WebSocket } from "ws";
//create a websocketserver 
//intialised web socket server using non native web socket library Websocketserver which we are using because we installed ws 
const wss = new WebSocketServer({ port: 3003 });
let userCount = 0;
// defined a global socket array using native Websoocket 
let allSockets = [];
//whenever there is a new connection to the websocket sewrver call a function and give it the socket 
wss.on("connection", (socket) => {
    //wrote this to push messages on one socket to all other sockets so users connected to other sockets can also recieve this message     
    allSockets.push(socket);
    //socket lets u talk to person who just connected to this socket, and can be used to send messages or recieve messages
    //socket servers have no methods, no query paramters 
    userCount = userCount + 1;
    console.log("User connected # " + userCount);
    //here server uses socket to receive message
    socket.on("message", (message) => {
        console.log("Message Recvd: " + message.toString());
        // now we send the message to all sockets
        for (let i = 0; i < allSockets.length; i++) {
            const s = allSockets[i];
            s?.send(message.toString() + ": sent from the server");
        }
    });
});
//# sourceMappingURL=index.js.map