import { useTheme } from '../../context/ThemeContext';

export default function Badge({ children, color = 'red' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colors = {
    red: { 
      dark:  'bg-red-900/30 text-red-300 border-red-500/30', 
      light: 'bg-red-50 text-red-600 border-red-200' 
    },
    green: { 
      dark:  'bg-green-900/30 text-green-300 border-green-500/30', 
      light: 'bg-green-50 text-green-600 border-green-200' 
    },
    yellow: { 
      dark:  'bg-yellow-900/30 text-yellow-300 border-yellow-500/30', 
      light: 'bg-yellow-50 text-yellow-700 border-yellow-200' 
    },
    blue: { 
      dark:  'bg-blue-900/30 text-blue-300 border-blue-500/30', 
      light: 'bg-blue-50 text-blue-600 border-blue-200' 
    },
    gray: { 
      dark:  'bg-slate-800 text-slate-400 border-slate-700', 
      light: 'bg-slate-100 text-slate-600 border-slate-200' 
    },
  };

  const colorConfig = colors[color] || colors.gray;
  const current = colorConfig[isDark ? 'dark' : 'light'];

  return (
    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${current} shadow-sm transition-all duration-300 hover:scale-105 select-none animate-fade-in`}>
      {children}
    </span>
  );
}
