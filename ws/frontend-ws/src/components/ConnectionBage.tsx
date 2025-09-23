'use client';
import type { ConnectionStatus } from '../chat/types';



const CONFIG: Record<
  ConnectionStatus,
  { color: string; anim: string; label: string; icon: string; ping: boolean }
> = {
  connected:    { color: 'bg-emerald-500',  anim: 'animate-pulse', label: 'Connected',   icon: '●', ping: true  },
  connecting:   { color: 'bg-amber-500',    anim: 'animate-spin',  label: 'Connecting',  icon: '↻', ping: false },
  error:        { color: 'bg-red-500',      anim: '',              label: 'Error',       icon: '✕', ping: false },
  disconnected: { color: 'bg-slate-400',    anim: '',              label: 'Offline',     icon: '○', ping: false },
};

export default function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  // ✅ Now this indexes cleanly—no implicit any
  const { color, anim, label, icon, ping } = CONFIG[status];

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
      <span className="text-xs leading-none text-slate-700" aria-hidden>
        {icon}
      </span>
      <div className="relative">
        <div className={`h-2.5 w-2.5 rounded-full ${color} ${anim}`} />
        {ping && (
          <div className={`absolute inset-0 h-2.5 w-2.5 rounded-full ${color} animate-ping opacity-75`} />
        )}
      </div>
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <span className="sr-only">Connection status: {label}</span>
    </div>
  );
}
