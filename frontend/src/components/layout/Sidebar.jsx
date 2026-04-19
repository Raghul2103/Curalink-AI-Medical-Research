import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';

const navItems = [
  { to: '/chat',      label: 'New Research', icon: '🔬' },
  { to: '/history',   label: 'History',      icon: '📋' },
  { to: '/dashboard', label: 'Dashboard',    icon: '📊' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const isDark = theme === 'dark';
  const [loggingOut, setLoggingOut] = useState(false);
  
  // Dynamic Indicator Logic
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0, opacity: 0 });
  const navRef = useRef(null);
  const itemRefs = useRef([]);

  // Recalculate position whenever the route changes
  useLayoutEffect(() => {
    const activeIndex = navItems.findIndex(item => location.pathname.startsWith(item.to));
    if (activeIndex !== -1 && itemRefs.current[activeIndex]) {
      const element = itemRefs.current[activeIndex];
      setIndicatorStyle({
        top: element.offsetTop,
        height: element.offsetHeight,
        opacity: 1
      });
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden transition-opacity duration-500"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
          onClick={onClose}
        />
      )}
      
      {/* Main Sidebar Container - Responsively Floating */}
      <div className={`
        fixed md:static z-50 h-[100dvh] transition-all duration-500
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-72 md:w-80 p-0 md:p-6 md:pr-0
      `}>
        <aside
          className="h-full w-full flex flex-col border-2 glass-card rounded-none md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-red-500/20"
          style={{ 
            borderColor: 'var(--bg-border)',
            backgroundColor: 'var(--glass-bg)'
          }}
        >
          {/* Logo Section - High Impact Wordmark */}
          <div
            className="p-6 sm:p-10 border-b-2 flex flex-col gap-1 relative overflow-hidden group"
            style={{ borderColor: 'var(--bg-border)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="flex items-center gap-4 relative z-10 transition-transform duration-500 group-hover:translate-x-1">
              <img src="/logo.png" alt="Curalink" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-2xl shadow-red-500/20" />
              <div className="flex flex-col gap-0.5">
                <span className="font-black text-3xl sm:text-4xl tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                  Curalink
                </span>
                <p className="text-[10px] uppercase font-black tracking-[0.3em] leading-none opacity-60" style={{ color: 'var(--text-primary)' }}>
                   AI Medical Research
                </p>
              </div>
            </div>
          </div>

          {/* Navigation - With Dynamic Liquid Indicator */}
          <nav 
            ref={navRef}
            className="flex-1 p-3 sm:p-5 pt-2 sm:pt-10 space-y-2 sm:space-y-4 overflow-y-auto relative no-scrollbar"
          >
            {/* Liquid Indicator Pill - Fixed via Dynamic Measurement */}
            <div 
              className="absolute left-3 sm:left-5 right-3 sm:right-5 rounded-3xl z-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg"
              style={{ 
                top: `${indicatorStyle.top}px`,
                height: `${indicatorStyle.height}px`,
                opacity: indicatorStyle.opacity,
                background: 'var(--nav-indicator)',
                filter: 'drop-shadow(0 0 15px var(--accent-glow))'
              }}
            />

            {navItems.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                ref={el => itemRefs.current[i] = el}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-4 sm:gap-5 px-4 sm:px-6 py-3 sm:py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 group relative z-10
                   animate-slide-in-left
                   ${isActive ? 'text-white' : 'text-[--text-secondary] hover:text-[--text-primary]'}`
                }
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 bg-white/5 border border-white/10 shadow-inner group-hover:border-red-500"
                >
                  {item.icon}
                </div>
                <span className="transition-all duration-500 group-hover:translate-x-2 group-hover:tracking-[0.3em] drop-shadow-sm leading-none">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Footer - Intelligence Telemetry & Mobile Actions */}
          <div
            className="p-4 sm:p-8 border-t-2 space-y-3 sm:space-y-6"
            style={{ borderColor: 'var(--bg-border)', backgroundColor: 'rgba(0,0,0,0.1)' }}
          >
            {/* Investigator Pill */}
            {user && (
              <div
                className="flex items-center gap-4 px-5 py-4 rounded-[2rem] border-2 transition-all duration-500 hover:border-red-600 group bg-white/5 glass-card"
                style={{ borderColor: 'var(--bg-border)' }}
              >
                <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-base font-black shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-700">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black truncate uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 md:hidden">
              {/* Mobile-Only Theme Toggle */}
              <button
                onClick={toggle}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-[1.5rem] border-2 transition-all duration-500 group"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--bg-border)',
                  color: '#ef4444',
                }}
              >
                {isDark ? (
                  <>
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36-6.36l-.7.7M6.34 17.66l-.7.7M17.66 17.66l-.7-.7M6.34 6.34l-.7-.7M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[--text-primary]">Light Mode</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 transition-transform group-hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[--text-primary]">Dark Mode</span>
                  </>
                )}
              </button>

              {/* Mobile-Only Sign Out */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center justify-center gap-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-6 py-3.5 sm:py-4 rounded-[1.5rem] transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em] border-2 border-transparent"
              >
                <span>{loggingOut ? 'Ejecting...' : 'Sign Out Platform'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
            
            <div className="text-center space-y-2 opacity-40">
               <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--text-muted)' }}>
                    Groq LPU Array
                  </p>
               </div>
               <p className="text-[9px] font-bold tracking-widest" style={{ color: 'var(--text-muted)' }}>
                 SECURE_UPLINK_ENCRYPTED
               </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
