import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useTheme } from '../../context/ThemeContext';

export default function MessageList({ messages, loading, onQuerySelect }) {
  const bottomRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-fade-in">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner border border-red-500/10 shadow-red-500/5">
            🔬
          </div>
          <h2 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            Curalink — AI Medical Research Assistant
          </h2>
          <p className="text-sm max-w-sm mx-auto mb-8 leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
            Ask about any medical condition, treatment, or clinical trial. I'll search PubMed, OpenAlex, and ClinicalTrials.gov for you.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
            {[
              { q: 'Latest treatment for lung cancer', d: 'Lung Cancer', icon: '🧬' },
              { q: 'Clinical trials for diabetes', d: 'Diabetes', icon: '🏥' },
              { q: 'Alzheimer\'s recent studies', d: 'Alzheimer\'s', icon: '🧠' },
              { q: 'Heart disease research 2024', d: 'Heart Disease', icon: '❤️' },
            ].map((item, i) => (
              <div 
                key={item.q} 
                onClick={() => !loading && onQuerySelect?.(item.q, item.d)}
                className={`group flex items-center gap-3 text-left text-xs font-bold border rounded-2xl px-4 py-3.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg glass-card animate-fade-in-up ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ 
                  animationDelay: `${0.2 + i * 0.1}s`,
                  borderColor: 'var(--bg-border)',
                  color: 'var(--text-secondary)'
                }}
              >
                <span className="text-base group-hover:scale-125 transition-transform">{item.icon}</span>
                <span className="transition-colors uppercase tracking-tight line-clamp-1 group-hover:text-red-500">"{item.q}"</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}
      {loading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
