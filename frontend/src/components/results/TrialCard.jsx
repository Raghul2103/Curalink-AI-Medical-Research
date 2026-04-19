import Badge from '../ui/Badge';

const statusColor = (status) => {
  if (!status) return 'gray';
  const s = status.toUpperCase();
  if (s.includes('RECRUITING')) return 'green';
  if (s.includes('COMPLETED')) return 'blue';
  if (s.includes('ACTIVE') || s.includes('ENROLL')) return 'yellow';
  if (s.includes('TERMINATED') || s.includes('WITHDRAWN')) return 'red';
  return 'gray';
};

const flattenText = (content) => {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (typeof content === 'number') return String(content);
  if (Array.isArray(content)) return content.map(flattenText).join(' ');
  if (typeof content === 'object') {
    let parts = [];
    if (content['#text']) parts.push(String(content['#text']));
    Object.keys(content).forEach(key => {
      if (key !== '#text' && key !== ':@') {
        const val = flattenText(content[key]);
        if (val) parts.push(val);
      }
    });
    return parts.join(' ').trim();
  }
  return String(content);
};

export default function TrialCard({ trial, index = 0 }) {
  const safeTitle = flattenText(trial.title);

  return (
    <div 
      className="rounded-2xl p-5 border transition-all duration-300 group hover:shadow-xl animate-fade-in-up glass-card"
      style={{ 
        backgroundColor: 'var(--bg-input)', 
        borderColor: 'var(--bg-border)',
        animationDelay: `${index * 0.08}s`
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0 overflow-hidden">
          <a
            href={trial.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-red-600 hover:text-red-500 leading-tight transition-colors line-clamp-3 break-words"
          >
            {safeTitle}
          </a>
          <div className="flex flex-wrap items-center gap-2 mt-2">
             <span className="text-[10px] font-bold text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-md border border-slate-500/20 truncate max-w-full">
               ID: {trial.id || 'N/A'}
             </span>
          </div>
        </div>
        <div className="shrink-0">
          <Badge color={statusColor(trial.status)}>
            {trial.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500">📍</span>
          <span className="font-medium truncate">{trial.location || 'Global/Remote'}</span>
        </div>
        
        {trial.contact && (
          <div className="flex items-center gap-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-5 h-5 flex items-center justify-center rounded-lg bg-green-500/10 text-green-500">📞</span>
            <span className="font-medium truncate">{trial.contact}</span>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--bg-border)' }}>
        <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">
           {trial.type || 'Clinical Trial'}
        </span>
        <button className="text-[10px] uppercase tracking-widest font-bold text-red-600 hover:scale-105 transition-transform">
          View Details →
        </button>
      </div>
    </div>
  );
}
