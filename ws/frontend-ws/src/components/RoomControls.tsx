"use client"

export default function RoomControls({
    connected,
    currentRoom,
    roomToJoin,
    setRoomToJoin,
    onJoin,
  }: {
    connected: boolean;
    currentRoom: string;
    roomToJoin: string;
    setRoomToJoin: (v: string) => void;
    onJoin: () => void;
  }) {
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') { 
        e.preventDefault(); 
        onJoin(); 
      }
    };
  
    return (
      <div className="space-y-3">
        {connected && !currentRoom && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={roomToJoin}
                onChange={(e) => setRoomToJoin(e.target.value)}
                onKeyDown={handleEnter}
                placeholder='Enter room name (e.g., "general")'
                className="w-full px-4 py-2.5 pl-10 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <button
              onClick={onJoin}
              disabled={!roomToJoin.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-medium rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 disabled:shadow-none"
            >
              Join Room
            </button>
          </div>
        )}
        {currentRoom && (
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm text-slate-700">Active in</span>
              <span className="text-sm font-bold text-blue-700">#{currentRoom}</span>
            </div>
            <span className="text-xs text-slate-500">Live</span>
          </div>
        )}
      </div>
    );
  }