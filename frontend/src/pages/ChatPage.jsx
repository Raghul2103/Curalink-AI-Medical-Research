import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import { exportChatToPDF, shareConversation } from '../utils/exportUtils';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(id || null);
  const [conversationData, setConversationData] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (id) {
      loadConversation(id);
    } else {
      setMessages([]);
      setConversationId(null);
      setConversationData(null);
      setInitialLoad(false);
    }
  }, [id]);

  const loadConversation = async (convId) => {
    try {
      const { data } = await api.get(`/chat/${convId}`);
      setMessages(data.data.messages);
      setConversationId(convId);
      setConversationData(data.data);
    } catch {
      toast.error('Could not load conversation');
    } finally {
      setInitialLoad(false);
    }
  };

  const handleSend = async ({ message, disease, patientName }) => {
    const userMsg = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await api.post('/chat/send', {
        message, disease, patientName,
        conversationId,
      });

      setConversationId(data.conversationId);
      if (!id) navigate(`/chat/${data.conversationId}`, { replace: true });

      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.answer,
        publications: data.publications,
        trials: data.trials,
      }]);
    } catch (err) {
      toast.error('Failed to get response');
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error getting response. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Session Action Bar */}
      {conversationId && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b shadow-sm z-30 animate-fade-in"
             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
              Lab Session Active
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => shareConversation(conversationData?.sessionTitle, messages[messages.length-1]?.content)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
              style={{ color: 'var(--text-primary)' }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            
            <div className="w-px h-4 bg-white/10" />
            
            <button
              onClick={() => exportChatToPDF(conversationData?.sessionTitle, messages)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all hover:bg-red-600/10 border border-transparent hover:border-red-600/20 text-red-500"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col relative">
        <MessageList 
          messages={messages} 
          loading={loading} 
          onQuerySelect={(q, d) => handleSend({ message: q, disease: d })}
        />
      </div>
      <ChatInput onSend={handleSend} loading={loading} showContext={messages.length === 0} />
    </div>
  );
}
