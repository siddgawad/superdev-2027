"use client"

import useChatSocket from "@/chat/useChatSocket";
import Shell from "@/components/Shell";


export default function Page() {
  const {
    status, username, currentRoom, messages,
    connect, disconnect, join, sendChat,
  } = useChatSocket();

  const isConnected = status === 'connected';
  const serverUrl = process.env.URL as string;

  return (
    <Shell
      status={status}
      username={username}
      currentRoom={currentRoom}
      messages={messages}
      onConnect={connect}
      onDisconnect={disconnect}
      onJoinRoom={join}
      onSendMessage={sendChat}
      isConnected={isConnected}
      serverUrl={serverUrl}
    />
  );
}