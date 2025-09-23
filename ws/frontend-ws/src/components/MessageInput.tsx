"use client"


export default function MessageInput({
    disabled,
    value,
    onChange,
    onSend,
    maxLength = 1000,
  }: {
    disabled: boolean;
    value: string;
    onChange: (v: string) => void;
    onSend: () => void;
    maxLength?: number;
  }) {
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault(); 
        onSend(); 
      }
    };
  
    const charPercentage = (value.length / maxLength) * 100;
    const charColor = charPercentage > 80 ? 'text-amber-600' : charPercentage > 60 ? 'text-amber-500' : 'text-slate-400';
  
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={value}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleEnter}
              placeholder={disabled ? "Join a room to start chatting..." : "Type your message..."}
              maxLength={maxLength}
              className="w-full px-4 py-3 pr-12 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed transition-all duration-200"
            />
            {!disabled && value.length > 0 && (
              <button
                onClick={() => onChange('')}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium transition-all duration-200 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:shadow-none flex items-center gap-2"
          >
            <span className="text-sm">Send</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="flex justify-between items-center px-1">
          <p className="text-xs text-slate-400">Press Enter to send</p>
          <p className={`text-xs ${charColor} transition-colors`}>
            {value.length}/{maxLength}
          </p>
        </div>
      </div>
    );
  }