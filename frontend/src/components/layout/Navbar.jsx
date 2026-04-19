import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [animateToggle, setAnimateToggle] = useState(false);
  
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const isDark = theme === 'dark';

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setFocused(false);
        setMobileSearchOpen(false);
        setQuery('');
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get('/chat/history');
        const q = query.toLowerCase();
        setResults(
          (data.data || []).filter((c) =>
            (c.sessionTitle || '').toLowerCase().includes(q) ||
            (c.disease || '').toLowerCase().includes(q)
          ).slice(0, 6)
        );
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleLogout = async () => { 
    setLoggingOut(true); 
    await logout(); 
  };

  const handleThemeToggle = () => {
    setAnimateToggle(true);
    toggle();
    setTimeout(() => setAnimateToggle(false), 600);
  };

  const goToResult = (id) => {
    navigate(`/chat/${id}`);
    setFocused(false);
    setMobileSearchOpen(false);
    setQuery('');
    setResults([]);
  };

  const showDropdown = (focused || mobileSearchOpen) && (query || searching);

  return (
    <nav
      className="navbar-main flex items-center justify-between px-4 sm:px-8 py-4 border-b-2 shrink-0 transition-all duration-500 z-50 sticky top-0 md:top-6 md:mx-6 md:rounded-[2.5rem]"
      style={{
        backgroundColor: 'var(--glass-bg)',
        borderColor: 'var(--bg-border)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: isDark ? '0 12px 48px -12px rgba(220, 38, 38, 0.3)' : '0 12px 48px -12px rgba(220, 38, 38, 0.15)',
      }}
    >
      {/* Left: Hamburger + Logo */}
      <div className={`flex items-center gap-4 animate-fade-in min-w-0 ${mobileSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
        <button
          onClick={onMenuClick}
          className="md:hidden p-3 rounded-2xl transition-all hover:bg-[--bg-hover] hover:scale-110 active:scale-90 shrink-0 border-2"
          style={{ borderColor: 'var(--bg-border)', color: 'var(--text-primary)' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-3 cursor-pointer group shrink-0 md:hidden" onClick={() => navigate('/dashboard')}>
          <img src="/logo.png" alt="Curalink" className="w-8 h-8 rounded-lg shadow-lg shadow-red-500/10 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col min-w-0">
            <span className="font-black text-xl tracking-tighter truncate" style={{ color: 'var(--text-primary)' }}>
              Curalink
            </span>
            <p className="text-[8px] uppercase font-black tracking-[0.2em] leading-none opacity-60 truncate" style={{ color: 'var(--text-primary)' }}>
              AI Medical Research
            </p>
          </div>
        </div>
      </div>

      {/* Center: Search Expansion - Refined Alignment */}
      <div 
        className={`relative transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center ${
          mobileSearchOpen 
            ? 'flex-1 mx-0 sm:mx-6' 
            : focused 
              ? 'flex-1 sm:max-w-md lg:max-w-lg mx-4 sm:mx-8' 
              : 'flex-1 sm:max-w-xs mx-3 sm:mx-8'
        }`} 
        ref={searchRef}
      >
        <div
          className={`flex items-center gap-3 rounded-[2rem] border-2 transition-all duration-500 w-full ${
            focused || mobileSearchOpen ? 'px-6 py-4 search-active bg-white/5 shadow-inner' : 'px-5 py-3.5 bg-[--bg-input]'
          }`}
          style={{
            borderColor: (focused || mobileSearchOpen) ? '#dc2626' : 'var(--bg-border)',
          }}
        >
          <svg className="w-5 h-5 shrink-0 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            style={{ 
              color: focused || mobileSearchOpen ? '#dc2626' : 'var(--text-muted)',
              transform: focused ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
            }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setFocused(true);
              if (window.innerWidth < 640) setMobileSearchOpen(true);
            }}
            placeholder={focused ? "Analyzing archives..." : "Research keyword..."}
            className={`flex-1 bg-transparent outline-none text-[11px] font-black uppercase tracking-[0.1em] placeholder:opacity-30 min-w-0 ${
              !mobileSearchOpen && 'hidden sm:block'
            }`}
            style={{ color: 'var(--text-primary)', caretColor: '#dc2626' }}
          />

          {(query || mobileSearchOpen) && (
            <button
              onClick={() => { 
                setQuery(''); 
                setResults([]); 
                if (mobileSearchOpen) {
                   setMobileSearchOpen(false);
                   setFocused(false);
                }
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] bg-black/10 hover:bg-black/20 transition-all hover:scale-110"
              style={{ color: 'var(--text-primary)' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown - Floating Premium Glass */}
        {showDropdown && (
          <div
            className="absolute top-full mt-6 left-0 right-0 rounded-[3rem] border-2 shadow-2xl z-50 overflow-hidden animate-scale-in glass-card backdrop-blur-3xl"
            style={{
              backgroundColor: 'var(--glass-bg)',
              borderColor: 'var(--bg-border)',
            }}
          >
            <div className="p-4">
              {searching && (
                <div className="px-6 py-10 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 animate-pulse">Scanning Bio-Data</span>
                </div>
              )}
              {!searching && results.length === 0 && query && (
                <div className="px-6 py-14 text-center animate-fade-in opacity-40">
                  <span className="text-5xl block mb-5 grayscale">📉</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero telemetry hits</p>
                </div>
              )}
              {results.map((r, i) => (
                <button
                  key={r._id}
                  onClick={() => goToResult(r._id)}
                  className="w-full text-left px-7 py-6 rounded-[2rem] transition-all duration-300 group hover:bg-white/5 mb-2 last:mb-0 border border-transparent hover:border-white/5"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center gap-6">
                    <span className="w-12 h-12 rounded-[1.2rem] bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-red-500/10 transition-all">📖</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black uppercase tracking-tight group-hover:text-red-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {r.sessionTitle || 'Investigation Logs'}
                      </p>
                      <p className="text-[9px] font-bold opacity-40 uppercase tracking-[0.2em] mt-1">Uplink Phase {i+1}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Premium Actions - Polished Alignment */}
      <div className={`items-center gap-2 sm:gap-5 animate-fade-in ${mobileSearchOpen ? 'hidden sm:flex' : 'hidden md:flex'}`}>
        <button
          onClick={handleThemeToggle}
          className={`p-4 rounded-[1.5rem] transition-all duration-500 hover:scale-110 active:scale-95 shrink-0 border-2 group relative overflow-hidden ${animateToggle ? 'animate-spin-once' : ''}`}
          style={{
            backgroundColor: 'var(--bg-input)',
            borderColor: 'var(--bg-border)',
            color: '#dc2626',
          }}
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isDark ? (
            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36-6.36l-.7.7M6.34 17.66l-.7.7M17.66 17.66l-.7-.7M6.34 6.34l-.7-.7M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <div className="h-10 w-px bg-slate-300/10 hidden md:block" />
        
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="group flex items-center gap-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-6 py-4 rounded-[1.5rem] transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em] border-2 border-transparent hover:shadow-2xl hover:shadow-red-500/30"
        >
          <span className="hidden sm:block">{loggingOut ? 'Ejecting...' : 'Sign Out'}</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
