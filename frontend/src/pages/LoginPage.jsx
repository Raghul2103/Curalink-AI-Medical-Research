import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast.success('Welcome back, Investigator');
        navigate('/chat');
      } else {
        await register(form.name, form.email, form.password);
        toast.success('Credentials Registered. Access Granted.');
        // Navigate back to login instead of auto-logging in
        setIsLogin(true);
        setForm(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden transition-colors duration-500"
         style={{ backgroundColor: 'var(--bg-base)' }}>
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
         <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />
         <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />
         <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gradient-to-b from-transparent via-red-600/10 to-transparent hidden md:block" />
         <div className="absolute top-0 bottom-0 right-1/4 w-px bg-gradient-to-b from-transparent via-red-600/10 to-transparent hidden md:block" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Branding */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-[2rem] flex items-center justify-center text-white text-3xl sm:text-4xl font-black mx-auto mb-6 shadow-2xl shadow-red-500/40 animate-bounce-gentle overflow-hidden">
            <img src="/logo.png" alt="Curalink" className="w-full h-full object-cover scale-110" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            CURALINK
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
             <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--text-muted)' }}>
                AI Medical Research Assistant
             </p>
          </div>
        </div>

        {/* Console Card */}
        <div className="relative group">
           {/* Decorative corner accents */}
           <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-red-600 rounded-tl-sm z-20" />
           <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-right border-red-600 rounded-tr-sm z-20" />
           <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-red-600 rounded-bl-sm z-20" />
           <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-right border-red-600 rounded-br-sm z-20" />

           <div className="glass-card border-2 rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]"
                style={{ borderColor: 'var(--bg-border)' }}>
             
             {/* Status Bar */}
             <div className="px-6 py-3 border-b-2 flex items-center justify-between" 
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}>
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                   System Node: 0xDC2626
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-red-600 animate-pulse">
                   {isLogin ? 'SECURE CHANNEL READY' : 'NEW CREDENTIAL OVERRIDE'}
                </span>
             </div>

             <div className="p-8 sm:p-10 space-y-8">
               {/* Controls */}
               <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border transition-colors" style={{ borderColor: 'var(--bg-border)' }}>
                  <button 
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${isLogin ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200'}`}
                  >
                     Sign In
                  </button>
                  <button 
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${!isLogin ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200'}`}
                  >
                     Register
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-5">
                 {!isLogin && (
                   <div className="animate-slide-in-left">
                     <p className="text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: 'var(--text-muted)' }}>Legal Full Name</p>
                     <input
                       type="text"
                       required
                       value={form.name}
                       onChange={(e) => setForm({ ...form, name: e.target.value })}
                       className="w-full bg-transparent border-2 rounded-2xl px-5 py-4 text-sm transition-all focus:shadow-[0_0_20px_rgba(220,38,38,0.15)] font-bold placeholder:italic placeholder:opacity-40"
                       style={{ borderColor: 'var(--bg-border)', color: 'var(--text-primary)' }}
                       placeholder="Investigator Name"
                     />
                   </div>
                 )}
                 <div className="animate-slide-in-left animate-delay-100">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: 'var(--text-muted)' }}>Security Email</p>
                   <input
                     type="email"
                     required
                     value={form.email}
                     onChange={(e) => setForm({ ...form, email: e.target.value })}
                     className="w-full bg-transparent border-2 rounded-2xl px-5 py-4 text-sm transition-all focus:shadow-[0_0_20px_rgba(220,38,38,0.15)] font-bold placeholder:italic placeholder:opacity-40"
                     style={{ borderColor: 'var(--bg-border)', color: 'var(--text-primary)' }}
                     placeholder="researcher@directory.curalink"
                   />
                 </div>
                 <div className="animate-slide-in-left animate-delay-200">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: 'var(--text-muted)' }}>Identification Cipher</p>
                   <input
                     type="password"
                     required
                     value={form.password}
                     onChange={(e) => setForm({ ...form, password: e.target.value })}
                     className="w-full bg-transparent border-2 rounded-2xl px-5 py-4 text-sm transition-all focus:shadow-[0_0_20px_rgba(220,38,38,0.15)] font-bold placeholder:italic placeholder:opacity-40"
                     style={{ borderColor: 'var(--bg-border)', color: 'var(--text-primary)' }}
                     placeholder="••••••••••••"
                   />
                 </div>
                 
                 <button 
                   type="submit"
                   disabled={loading}
                   className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl flex items-center justify-center gap-3 group relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                   }}
                 >
                   {loading ? (
                     <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                   ) : (
                     <>
                        <span className="w-1 h-1 rounded-full bg-red-600 animate-ping" />
                        {isLogin ? 'Initialize Uplink' : 'Encrypt Identity'}
                     </>
                   )}
                 </button>
               </form>
               
               <div className="text-center pt-4 border-t-2" style={{ borderColor: 'var(--bg-border)' }}>
                  <p className="text-[9px] font-black uppercase tracking-widest leading-loose" style={{ color: 'var(--text-muted)' }}>
                    Unauthorized access to this terminal is strictly prohibited. <br/>
                    Logs are monitored and recorded.
                  </p>
               </div>
             </div>
           </div>
        </div>
        
        <div className="mt-8 text-center flex items-center justify-center gap-6 animate-fade-in animate-delay-300">
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-red-600">Stability</span>
              <span className="text-[9px] font-bold opacity-40" style={{ color: 'var(--text-primary)' }}>v2.0.4-STABLE</span>
           </div>
           <div className="w-px h-6 bg-slate-500/20" />
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-red-600">Encryption</span>
              <span className="text-[9px] font-bold opacity-40" style={{ color: 'var(--text-primary)' }}>RSA-4096 / SSL</span>
           </div>
        </div>
      </div>
    </div>
  );
}
