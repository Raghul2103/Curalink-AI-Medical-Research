import { useState } from 'react';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

export default function ChatInput({ onSend, loading, showContext = true }) {
  const [message, setMessage] = useState('');
  const [disease, setDisease] = useState('');
  const [patientName, setPatientName] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSend = () => {
    if (!message.trim() || loading) return;
    onSend({ message, disease, patientName });
    setMessage('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const inputClass = `
    w-full border rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-all duration-200
    focus:outline-none placeholder:opacity-70 min-h-[40px] sm:min-h-[44px] font-medium
  `;

  const inputStyle = {
    backgroundColor: 'var(--bg-input)',
    borderColor: 'var(--bg-border)',
    color: 'var(--text-primary)',
  };

  return (
    <div
      className="p-3 sm:p-5 space-y-3 sm:space-y-4 animate-fade-in relative z-20"
      style={{ 
        backgroundColor: isDark ? 'var(--bg-card)' : 'rgba(255,255,255,0.95)',
        borderTop: `1px solid var(--bg-border)`,
        backdropFilter: isDark ? 'none' : 'blur(20px)'
      }}
    >
      {showContext && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
          <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600 opacity-70">👤</span>
             <input
              className={`${inputClass} pl-9 sm:pl-10`}
              style={inputStyle}
              placeholder="Patient identifier (Optional)"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>
          <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600 opacity-70">🏥</span>
             <input
              className={`${inputClass} pl-9 sm:pl-10`}
              style={inputStyle}
              placeholder="Medical context / Disease"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 items-end animate-fade-in-up">
        <textarea
          className={`${inputClass} resize-none flex-1 py-3 sm:py-3 leading-relaxed overflow-hidden h-12 sm:h-14 focus:h-24 transition-all duration-300 shadow-sm border-2`}
          style={{
             ...inputStyle,
             borderColor: 'var(--bg-border)',
          }}
          placeholder="Type your medical query here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="btn-primary shrink-0 flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black uppercase tracking-tighter text-white transition-all duration-300 disabled:opacity-30 disabled:grayscale active:scale-90 group relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            boxShadow: loading || !message.trim() ? 'none' : '0 10px 20px -5px rgba(220, 38, 38, 0.4)',
          }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
               <span className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">🚀</span>
               <span className="hidden sm:inline">Discovery</span>
            </div>
          )}
        </button>
      </div>
      <p className="text-[10px] sm:text-xs text-center font-bold tracking-tight" style={{ color: 'var(--text-muted)' }}>
        AI research assistant powered by Groq LPU™ · PubMed · OpenAlex · ClinicalTrials.gov
      </p>
    </div>
  );
}
