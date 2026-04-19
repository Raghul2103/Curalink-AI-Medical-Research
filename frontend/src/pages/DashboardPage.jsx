import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ label, value, icon, sub, delay = 0, gradient }) => (
  <div
    className="stat-card rounded-2xl p-5 sm:p-6 flex flex-col gap-2 animate-fade-in-up h-full relative overflow-hidden group"
    style={{
      backgroundColor: 'var(--bg-card)',
      borderColor: 'var(--bg-border)',
      animationDelay: `${delay}s`,
    }}
  >
    {/* Subtle Background Glow */}
    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500 group-hover:scale-150" 
         style={{ background: gradient || 'var(--accent-glow)' }} />

    <div className="flex items-start justify-between relative z-10">
      <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <span
        className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/10 group-hover:rotate-12 transition-all duration-300"
        style={{ background: gradient || 'var(--accent-subtle)' }}
      >
        {icon}
      </span>
    </div>
    <p className="text-3xl sm:text-4xl font-black mt-2 leading-tight" style={{ color: 'var(--text-primary)' }}>{value}</p>
    {sub && <p className="text-xs font-bold leading-none mt-1" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
  </div>
);

const steps = [
  { n: '1', icon: '🔍', text: 'Smart Medical Search Engine', color: '#dc2626' },
  { n: '2', icon: '📡', text: 'Peer-Reviewed Source Retrieval', color: '#991b1b' },
  { n: '3', icon: '📊', text: 'Semantic Ranking & Selection', color: '#7f1d1d' },
  { n: '4', icon: '🧠', text: 'Generative AI Research Summary', color: '#450a0a' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ conversations: 0, latest: null });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/chat/history');
      const convs = data.data || [];
      setStats({ conversations: convs.length, latest: convs[0] || null });
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStats();
    const onFocus = () => fetchStats();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-6xl mx-auto space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="flex items-center gap-6 animate-fade-in-up">
        <img src="/logo.png" alt="Curalink" className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl shadow-2xl shadow-red-500/20 group-hover:scale-110 transition-transform" />
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm sm:text-lg mt-1 font-medium italic opacity-60" style={{ color: 'var(--text-secondary)' }}>
            Institutional Clinical Research Directory Dashboard.
          </p>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        <StatCard
          label="Knowledge Graph"
          value={loading ? '—' : stats.conversations}
          icon="🔬"
          sub="Indexed sessions"
          delay={0}
          gradient="linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(220, 38, 38, 0.05))"
        />
        <StatCard
          label="Verification"
          value="Verified"
          icon="🛡️"
          sub="Institutional Access"
          delay={0.1}
          gradient="linear-gradient(135deg, rgba(153, 27, 27, 0.2), rgba(153, 27, 27, 0.05))"
        />
        <div
          className="stat-card col-span-1 sm:col-span-2 lg:col-span-1 rounded-2xl p-6 animate-fade-in-up border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--bg-border)', animationDelay: '0.2s' }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(220, 38, 38, 0.05))' }}>
              📡
            </span>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Connected Sources</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'PubMed Central', color: '#dc2626' },
              { label: 'OpenAlex', color: '#991b1b' },
              { label: 'ClinicalTrials.gov', color: '#7f1d1d' },
            ].map((s) => (
              <span
                key={s.label}
                className="text-[10px] sm:text-xs rounded-xl px-4 py-2 font-black transition-all hover:scale-105"
                style={{ backgroundColor: `${s.color}15`, color: s.color, border: `1px solid ${s.color}25` }}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Latest / Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Latest Session Card */}
        <div className="lg:col-span-7 space-y-6">
           {stats.latest ? (
              <div
                className="history-card rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 animate-fade-in-up glass-card group cursor-pointer"
                style={{ borderColor: 'var(--bg-border)' }}
                onClick={() => navigate(`/chat/${stats.latest._id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                    Resume Active Lab Investigation
                  </p>
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:translate-x-1 transition-transform">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                     </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black mb-4 group-hover:text-red-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {stats.latest.sessionTitle || 'Investigation: Pending Title'}
                </h3>
                <div className="flex items-center gap-3">
                  {stats.latest.disease && (
                    <span className="text-[10px] sm:text-[11px] text-white bg-red-600 rounded-lg px-3 py-1 font-black uppercase tracking-tighter">
                      {stats.latest.disease}
                    </span>
                  )}
                  <div className="w-1 h-1 rounded-full bg-slate-500" />
                  <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                    Last update: {new Date(stats.latest.updatedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="rounded-3xl p-12 border-2 border-dashed text-center animate-fade-in-up"
                style={{ borderColor: 'var(--bg-border)' }}
              >
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📭</div>
                <p className="text-lg font-bold" style={{ color: 'var(--text-muted)' }}>The directory is silent.</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Initiate your first research query to see live telemetry.</p>
              </div>
            )}
            
            <button
               onClick={() => navigate('/chat')}
               className="w-full py-5 rounded-3xl text-sm font-black uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden shadow-2xl"
               style={{
                 background: 'linear-gradient(135deg, #dc2626, #991b1b)',
               }}
             >
               <span className="text-xl group-hover:rotate-12 transition-transform">🧪</span>
               New Research Investigation
            </button>
        </div>

        {/* Pipeline / Steps */}
        <div className="lg:col-span-5 space-y-6">
           <div
            className="rounded-3xl p-6 sm:p-8 border animate-fade-in-up glass-card"
            style={{ borderColor: 'var(--bg-border)' }}
          >
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8" style={{ color: 'var(--text-muted)' }}>
               Intelligence Lifecycle
            </h2>
            <div className="space-y-6">
              {steps.map(({ n, icon, text, color }, i) => (
                <div key={n} className="flex items-start gap-5 group" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm border border-black/5 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: `${color}15`, color }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Phase 0{n}</p>
                    <p className="text-sm sm:text-base font-bold leading-tight" style={{ color: 'var(--text-secondary)' }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
