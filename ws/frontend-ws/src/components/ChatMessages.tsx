"use client"
import type {Message} from '../chat/types';


export default function ChatMessages({
    messages,
    bottomRef,
  }: {
    messages: Message[];
    bottomRef: React.RefObject<HTMLDivElement | null>;
  }) {
    return (
      <div className="h-[500px] bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-slate-500 font-medium">No messages yet</p>
              <p className="text-sm text-slate-400 mt-1">Start the conversation!</p>
            </div>
          ) : (
            messages.map((m) => {
              const time = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isSystem = m.text.startsWith('You joined room:');
              
              if (isSystem) {
                return (
                  <div key={m.id} className="flex justify-center">
                    <div className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
                      {m.text}
                    </div>
                  </div>
                );
              }
              
              return (
                <div
                  key={m.id}
                  className={`flex ${m.isOwn ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                      m.isOwn 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="text-sm leading-relaxed break-words">{m.text}</div>
                    <div className={`text-xs mt-1 ${m.isOwn ? 'text-blue-100' : 'text-slate-400'}`}>
                      {time}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    );
  }