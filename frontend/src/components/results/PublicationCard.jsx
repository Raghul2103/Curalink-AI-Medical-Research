import Badge from '../ui/Badge';

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

export default function PublicationCard({ pub, index = 0 }) {
  const safeTitle = flattenText(pub.title);
  const safeAbstract = flattenText(pub.abstract);

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
        <div className="flex-1 min-w-0">
          <a
            href={pub.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-red-600 hover:text-red-500 leading-tight transition-colors line-clamp-3"
          >
            {safeTitle}
          </a>
          <p className="text-[11px] font-medium mt-1.5 flex flex-wrap items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <span className="min-w-0 break-words">👥 {pub.authors?.slice(0, 3).join(', ')}{pub.authors?.length > 3 ? ' et al.' : ''}</span>
            <span className="opacity-40">•</span>
            <span className="shrink-0 italic">📅 {pub.year}</span>
          </p>
        </div>
        <div className="shrink-0">
          <Badge color={pub.source === 'PubMed' ? 'red' : 'red'}>
            {pub.source}
          </Badge>
        </div>
      </div>
      
      {pub.abstract && pub.abstract !== 'No abstract available' && (
        <div className="relative">
          <p 
            className="text-xs leading-relaxed line-clamp-3" 
            style={{ color: 'var(--text-secondary)' }}
          >
            {safeAbstract}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(to top, var(--bg-input), transparent)' }} />
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--bg-border)' }}>
        {/* <button className="text-[10px] uppercase tracking-widest font-bold text-red-600 hover:underline flex items-center gap-1">
          Read Full Paper 
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button> */}
        <div className="flex gap-1">
          {['Medicine', 'Research'].map(tag => (
            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10" style={{ color: 'var(--text-muted)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
