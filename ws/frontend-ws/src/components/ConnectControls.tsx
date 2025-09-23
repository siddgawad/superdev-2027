"use client"

import type { ConnectionStatus} from '../chat/types';



export default function ConnectControls({
  status,
  onConnect,
  onDisconnect,
}: {
  status: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <div className="flex gap-2">
      {status === 'disconnected' || status === 'error' ? (
        <button
          onClick={onConnect}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
        >
          Connect to Server
        </button>
      ) : status === 'connecting' ? (
        <button
          disabled
          className="px-4 py-2 bg-slate-200 text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed flex items-center gap-2"
        >
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Connecting...
        </button>
      ) : (
        <button
          onClick={onDisconnect}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/25"
        >
          Disconnect
        </button>
      )}
    </div>
  );
}