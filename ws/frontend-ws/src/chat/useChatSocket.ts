"use client"

import { useCallback, useEffect, useRef, useState} from 'react';

import type { ConnectionStatus,Message,RoomId,ClientMsg,ChatMsg } from './types';

export default function useChatSocket() {
    const WS_URL = process.env.URL as string;
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const wsRef = useRef<WebSocket | null>(null);
    const [currentRoom, setCurrentRoom] = useState<RoomId>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUsername] = useState<string>('');
  
    useEffect(() => {
      const adjectives = ['Cool','Smart','Fast','Bright','Happy','Lucky','Bold','Swift'];
      const nouns = ['Tiger','Eagle','Wolf','Fox','Bear','Lion','Hawk','Shark'];
      const adj = adjectives[Math.floor(Math.random()*adjectives.length)];
      const noun = nouns[Math.floor(Math.random()*nouns.length)];
      const num = Math.floor(Math.random()*100);
      setUsername(`${adj}${noun}${num}`);
    }, []);
  
    const sendRaw = useCallback((msg: ClientMsg): boolean => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return false;
      ws.send(JSON.stringify(msg));
      return true;
    }, []);
  
    const connect = useCallback(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;
      setStatus('connecting');
  
      try {
        const ws = new WebSocket(WS_URL);
  
        ws.onopen = () => {
          wsRef.current = ws;
          setStatus('connected');
        };
  
        ws.onmessage = (ev: MessageEvent<string>) => {
          setMessages(prev => [
            ...prev,
            { id: crypto.randomUUID(), text: ev.data, timestamp: Date.now(), isOwn: false },
          ]);
        };
  
        ws.onclose = () => {
          setStatus('disconnected');
          wsRef.current = null;
          setCurrentRoom('');
        };
  
        ws.onerror = () => {
          setStatus('error');
          wsRef.current = null;
        };
      } catch {
        setStatus('error');
      }
    }, [WS_URL]);
  
    const disconnect = useCallback(() => {
      wsRef.current?.close();
    }, []);
  
    const join = useCallback((roomId: RoomId) => {
      const room = roomId.trim();
      if (!room || status !== 'connected') return false;
  
      const ok = sendRaw({ type: 'join', payload: { roomId: room } });
      if (!ok) return false;
  
      setCurrentRoom(room);
      setMessages([
        {
          id: crypto.randomUUID(),
          text: `You joined room: ${room}`,
          timestamp: Date.now(),
          isOwn: false,
        },
      ]);
      return true;
    }, [sendRaw, status]);
  
    const sendChat = useCallback((text: string) => {
      const msg = text.trim();
      if (!msg || !currentRoom || status !== 'connected') return false;
  
      const composed = `${username}: ${msg}`;
      const payload: ChatMsg = { type: 'chat', payload: { roomId: currentRoom, message: composed } };
  
      const ok = sendRaw(payload);
      if (!ok) return false;
  
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), text: composed, timestamp: Date.now(), isOwn: true },
      ]);
      return true;
    }, [currentRoom, sendRaw, status, username]);
  
    return {
      status,
      username,
      currentRoom,
      messages,
      connect,
      disconnect,
      join,
      sendChat,
    };
  }
  