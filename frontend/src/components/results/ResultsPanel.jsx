import { useState } from 'react';
import PublicationCard from './PublicationCard';
import TrialCard from './TrialCard';

export default function ResultsPanel({ publications = [], trials = [] }) {
  const [tab, setTab] = useState('publications');

  if (!publications.length && !trials.length) return null;

  return (
    <div className="mt-4 sm:mt-8 border-2 rounded-2xl sm:rounded-[32px] overflow-hidden glass-card animate-scale-in shadow-2xl transition-all duration-500 max-w-full overflow-x-hidden" 
         style={{ borderColor: 'var(--bg-border)' }}>
      {/* Tab Header - Premium Industrial Design */}
      <div className="flex p-1.5 sm:p-2 gap-1.5 sm:gap-2" style={{ backgroundColor: 'var(--bg-card)' }}>
        <button
          onClick={() => setTab('publications')}
          className={`flex-1 flex flex-col items-center justify-center py-3 sm:py-5 rounded-xl sm:rounded-[24px] transition-all duration-300 relative overflow-hidden group ${
            tab === 'publications' 
              ? 'bg-red-600 text-white shadow-xl shadow-red-500/20' 
              : 'text-slate-500 hover:bg-[--bg-hover]'
          }`}
        >
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] relative z-10 transition-transform group-hover:-translate-y-0.5">
             Publications
          </span>
          <span className={`text-lg sm:text-2xl font-black mt-1 relative z-10 ${tab === 'publications' ? 'text-white/40' : 'text-slate-300'}`}>
             {String(publications.length).padStart(2, '0')}
          </span>
          {tab === 'publications' && (
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/20 animate-fade-in" />
          )}
        </button>

        <button
          onClick={() => setTab('trials')}
          className={`flex-1 flex flex-col items-center justify-center py-3 sm:py-5 rounded-xl sm:rounded-[24px] transition-all duration-300 relative overflow-hidden group ${
            tab === 'trials' 
              ? 'bg-red-600 text-white shadow-xl shadow-red-500/20' 
              : 'text-slate-500 hover:bg-[--bg-hover]'
          }`}
        >
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] relative z-10 transition-transform group-hover:-translate-y-0.5">
             Clinical Trials
          </span>
          <span className={`text-lg sm:text-2xl font-black mt-1 relative z-10 ${tab === 'trials' ? 'text-white/40' : 'text-slate-300'}`}>
             {String(trials.length).padStart(2, '0')}
          </span>
          {tab === 'trials' && (
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/20 animate-fade-in" />
          )}
        </button>
      </div>

      {/* Content - Deep contrast list */}
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-h-[30rem] sm:max-h-[40rem] overflow-y-auto themed-bg shadow-inner transition-colors duration-300"
           style={{ backgroundColor: 'var(--bg-base)' }}>
        {tab === 'publications' ? (
          publications.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
               {publications.map((pub, i) => <PublicationCard key={i} pub={pub} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20 animate-fade-in">
               <span className="text-4xl block mb-2 opacity-20">📚</span>
               <p className="text-sm font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>No Intelligence Artifacts Found</p>
            </div>
          )
        ) : (
          trials.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
               {trials.map((trial, i) => <TrialCard key={i} trial={trial} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20 animate-fade-in">
               <span className="text-4xl block mb-2 opacity-20">🏥</span>
               <p className="text-sm font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>No Ongoing Trials Located</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
