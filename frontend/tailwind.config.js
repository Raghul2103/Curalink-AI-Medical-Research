/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          200: '#c0ccff',
          300: '#93a8fd',
          400: '#6e87fb',
          500: '#4f6ef7',
          600: '#3b55e6',
          700: '#2d43c7',
          900: '#1a2680',
        },
        surface: {
          DEFAULT: '#0f1117',
          card:    '#1a1d2e',
          border:  '#2a2d40',
          hover:   '#252840',
        },
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(79,110,247,0.3)' },
          '50%':      { boxShadow: '0 0 20px rgba(79,110,247,0.6)' },
        },
      },
      animation: {
        'fade-in-up':     'fade-in-up 0.4s ease both',
        'fade-in':        'fade-in 0.3s ease both',
        'slide-in-left':  'slide-in-left 0.35s ease both',
        'slide-in-right': 'slide-in-right 0.35s ease both',
        'scale-in':       'scale-in 0.25s ease both',
        'shimmer':        'shimmer 2s linear infinite',
        'pulse-soft':     'pulse-soft 2s ease-in-out infinite',
        'bounce-gentle':  'bounce-gentle 2s ease-in-out infinite',
        'glow-pulse':     'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
