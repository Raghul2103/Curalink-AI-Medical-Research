import ResultsPanel from '../results/ResultsPanel';
import { useTheme } from '../../context/ThemeContext';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`flex gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 animate-fade-in-up ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar - Smaller on mobile */}
      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[12px] sm:rounded-2xl flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 mt-0.5 shadow-lg transition-transform hover:scale-110 ${
        isUser
          ? 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-red-500/30'
          : isDark
            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
            : 'bg-gradient-to-br from-red-50 to-red-100 text-red-600 border border-red-200'
      }`}>
        {isUser ? '👤' : '🧠'}
      </div>

      {/* Bubble - Responsive with and padding */}
      <div className={`max-w-[88%] sm:max-w-[85%] flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="relative group/bubble">
          <div
            className={`rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-sm transition-all duration-200 ${
              isUser ? 'msg-user' : 'msg-ai'
            } ${
              isUser ? (isDark ? 'bg-red-500/20 text-slate-100 border border-red-500/30' : '')
                     : (isDark ? 'bg-surface-card text-slate-200 border border-surface-border' : '')
            }`}
          >
            {message.content}
          </div>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(message.content);
              alert('Telemetry copied to clipboard'); // Simple for now, can be improved with toast
            }}
            className={`absolute top-0 ${isUser ? '-left-8' : '-right-8'} p-1.5 rounded-lg opacity-0 group-hover/bubble:opacity-100 transition-all hover:scale-110 active:scale-90 bg-red-500/10 text-red-500 border border-red-500/20`}
            title="Copy Telemetry"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>

        {/* Results panel - ensure clean entry */}
        {!isUser && (message.publications?.length > 0 || message.trials?.length > 0) && (
          <div className="w-full animate-fade-in-up animate-delay-200 overflow-hidden">
            <ResultsPanel publications={message.publications} trials={message.trials} />
          </div>
        )}
      </div>
    </div>
  );
}
