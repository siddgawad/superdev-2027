"use client"

import React, {useEffect, useRef, useState} from 'react';
import ConnectionBadge from './ConnectionBage';
import RoomControls from './RoomControls';
import ConnectControls from './ConnectControls';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import type { ConnectionStatus,Message} from '../chat/types';


export default function Shell({
    status,
    username,
    currentRoom,
    messages,
    onConnect,
    onDisconnect,
    onJoinRoom,
    isConnected,
    serverUrl,
    onSendMessage,
  }: {
    status: ConnectionStatus;
    username: string;
    currentRoom: string;
    messages: Message[];
    onConnect: () => void;
    onDisconnect: () => void;
    onJoinRoom: (roomId: string) => void;
    onSendMessage: (text: string) => void;
    isConnected: boolean;
    serverUrl: string;
  }) {
    const [roomToJoin, setRoomToJoin] = useState('general');
    const [draft, setDraft] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
  
    const handleSend = () => {
      if (draft.trim()) {
        onSendMessage(draft);
        setDraft('');
      }
    };
  
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <div className="min-h-screen backdrop-blur-3xl">
          <div className="mx-auto max-w-5xl p-6">
            {/* Header Section */}
            <header className="mb-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chat Rooms</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {isConnected ? (
                        <span className="flex items-center gap-1.5">
                          <span>Logged in as</span>
                          <span className="font-semibold text-slate-700">{username}</span>
                        </span>
                      ) : (
                        'Connect to start chatting'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <ConnectionBadge status={status} />
                  <ConnectControls status={status} onConnect={onConnect} onDisconnect={onDisconnect} />
                </div>
              </div>
  
              <RoomControls
                connected={isConnected}
                currentRoom={currentRoom}
                roomToJoin={roomToJoin}
                setRoomToJoin={setRoomToJoin}
                onJoin={() => onJoinRoom(roomToJoin)}
              />
  
              {isConnected && !currentRoom && (
                <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Quick Start Guide
                  </h3>
                  <ol className="space-y-1 text-sm text-amber-800">
                  <li className="flex items-start gap-2">
    <span className="font-semibold">1.</span>
    <span>Enter a room name above (e.g., &quot;general&quot;, &quot;team-chat&quot;)</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="font-semibold">2.</span>
    <span>Click &quot;Join Room&quot; or press Enter</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="font-semibold">3.</span>
    <span>Open a second tab and join the same room to test</span>
  </li>
                  </ol>
                </div>
              )}
            </header>
  
            {/* Chat Section */}
            {currentRoom && (
              <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-6 animate-fadeIn">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Room Messages
                  </h2>
                  <div className="text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded-full">
                    {messages.filter(m => !m.text.startsWith('You joined')).length} messages
                  </div>
                </div>
                
                <ChatMessages messages={messages} bottomRef={bottomRef} />
                
                <div className="mt-4">
                  <MessageInput
                    disabled={!isConnected || !currentRoom}
                    value={draft}
                    onChange={setDraft}
                    onSend={handleSend}
                  />
                </div>
              </section>
            )}
  
            {/* Error State */}
            {status === 'error' && (
              <section className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 animate-fadeIn">
                <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Connection Error
                </h3>
                <ul className="space-y-1 text-sm text-red-700">
                  <li>• Ensure the WebSocket server is running</li>
                  <li>• Check if the server URL is correct: <code className="px-1 py-0.5 bg-red-100 rounded">{serverUrl}</code></li>
                </ul>
              </section>
            )}
          </div>
        </div>
        
        {/* Add animation styles */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </main>
    );
  }