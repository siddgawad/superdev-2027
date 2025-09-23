export type RoomId = string;
export type JoinMsg = { type: 'join'; payload: { roomId: RoomId } };
export type ChatMsg = { type: 'chat'; payload: { roomId: RoomId; message: string } };
export type ClientMsg = JoinMsg | ChatMsg;
export type Message = { id: string; text: string; timestamp: number; isOwn: boolean };
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
