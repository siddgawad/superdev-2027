import { useEffect, useState,useRef } from "react";
import "./App.css";

export default function App(){
const [socket,setSocket] = useState<WebSocket|null>(null);
const inputRef = useRef<HTMLInputElement|null>(null);

  function sendMessage(){
    if(!socket || socket.readyState!==WebSocket.OPEN){
      return;
    }
    const message = inputRef.current?.value;
    if (message) {
      socket.send(message);
    }
  }

// when we give empty dependency array to useEffect, the code only runs once when the component runs
useEffect(()=>{
  const wss = new WebSocket("ws://localhost:3000");
  setSocket(wss);
  // this is how we start recieving events on alerts
  wss.onmessage=(ev:MessageEvent)=>{
    if(typeof ev.data==="string")
      alert(ev.data)
  };
  
  return () => {
    if (wss.readyState === WebSocket.OPEN || wss.readyState === WebSocket.CONNECTING) {
      wss.close();
    }
  };
},[]);

  return(
    <div>
      <input ref={inputRef} type="text" placeholder="Message..."></input>
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}