import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/ui/Spinner';

export default function HistoryPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const navigate = useNavigate();

  const fetchHistory = (page = 1) => {
    setLoading(true);
    api.get(`/chat/history?page=${page}&limit=10`)
      .then(({ data }) => {
        setConversations(data.data);
        setPagination(data.pagination);
      })
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/${id}`);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading && !conversations.length) return (
    <div className="flex justify-center items-center h-[50vh]">
      <Spinner />
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            📋 Research Archives
          </h1>
          <p className="text-[10px] sm:text-xs mt-1 font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--text-muted)' }}>
            {pagination.totalItems || 0} Telemetry Artifacts Logged
          </p>
        </div>
        
        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.currentPage === 1 || loading}
              onClick={() => fetchHistory(pagination.currentPage - 1)}
              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all disabled:opacity-30 disabled:grayscale hover:bg-white/5"
              style={{ borderColor: 'var(--bg-border)', color: 'var(--text-primary)' }}
            >
              ← Prev
            </button>
            <span className="text-[10px] font-black uppercase opacity-60 px-2">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.currentPage === pagination.totalPages || loading}
              onClick={() => fetchHistory(pagination.currentPage + 1)}
              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all disabled:opacity-30 disabled:grayscale hover:bg-white/5"
              style={{ borderColor: 'var(--bg-border)', color: 'var(--text-primary)' }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-20 animate-fade-in glass-card rounded-3xl border" style={{ borderColor: 'var(--bg-border)' }}>
          <div className="text-4xl sm:text-5xl mb-4">🔬</div>
          <p className="text-base sm:text-lg font-black" style={{ color: 'var(--text-primary)' }}>Archives Empty</p>
          <p className="text-xs sm:text-sm mb-6 max-w-xs mx-auto px-4 font-medium opacity-60" style={{ color: 'var(--text-muted)' }}>Initiate a medical query to begin intelligence logging.</p>
          <button
            onClick={() => navigate('/chat')}
            className="px-8 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white transition-all shadow-2xl active:scale-95"
            style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 8px 30px rgba(220,38,38,0.4)' }}
          >
            New Research Discovery
          </button>
        </div>
      ) : (
        <div className={`space-y-3 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {conversations.map((conv, i) => (
            <div
              key={conv._id}
              onClick={() => navigate(`/chat/${conv._id}`)}
              className="history-card flex items-center justify-between rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 cursor-pointer border transition-all duration-300 group animate-fade-in-up"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--bg-border)',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <div className="min-w-0 flex items-center gap-3 sm:gap-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl shrink-0 transition-all group-hover:scale-110 group-hover:rotate-6 bg-red-500/10 border border-red-500/20"
                >
                  🧬
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black truncate group-hover:text-red-600 transition-colors uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {conv.sessionTitle || 'Investigation Log'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {conv.disease && (
                      <span className="inline-block text-[9px] font-black uppercase text-white bg-red-600 rounded-md px-2 py-0.5 shadow-sm">
                        {conv.disease}
                      </span>
                    )}
                    <p className="text-[10px] font-black uppercase tracking-tighter opacity-40 italic" style={{ color: 'var(--text-muted)' }}>
                      Synchronized: {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => handleDelete(conv._id, e)}
                className="ml-2 w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90 bg-red-500/10 text-red-500 border border-red-500/20"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
