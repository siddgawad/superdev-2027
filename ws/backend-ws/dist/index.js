import { WebSocketServer, WebSocket } from "ws";
//create a websocketserver 
//intialised web socket server using non native web socket library Websocketserver which we are using because we installed ws 
const wss = new WebSocketServer({ port: 3003 });
let userCount = 0;
// defined a global socket array using native Websoocket 
let allSockets = []; //maps,records - use here
//whenever there is a new connection to the websocket sewrver call a function and give it the socket 
wss.on("connection", (socket) => {
    //socket lets u talk to person who just connected to this socket, and can be used to send messages or recieve messages
    //socket servers have no methods, no query paramters 
    userCount = userCount + 1;
    console.log("User connected # " + userCount);
    //here server uses socket to receive message
    socket.on("message", (message) => {
        //ws lib retrurns data on RawData form so we fist normalsie itn to buffer so we can convert to string
        const text = Buffer.isBuffer(message);
        //once we convert to string, we need to store objects
        const response = text.toString();
        const parsedMsg = JSON.parse(response);
        if (parsedMsg.type === "join") {
            allSockets.push({
                socket,
                room: parsedMsg.payload.roomId
            });
            if (parsedMsg === "chat") {
                const currentRoom = allSockets.find((x) => x.socket === socket);
                currentRoom.socket.send(parsedMsg.payload.message);
            }
        }
    });
    socket.on("disconnect", () => {
    });
});
//# sourceMappingURL=index.js.map