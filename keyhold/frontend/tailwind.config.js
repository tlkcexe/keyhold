/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Deep navy surfaces for dark mode — the "vault" backdrop.
        ink: {
          50: '#F4F5F7',
          100: '#E4E6EB',
          200: '#C4C9D4',
          300: '#9AA1B2',
          400: '#6B7186',
          500: '#4B5166',
          600: '#363B4D',
          700: '#252939',
          800: '#1A1E2B',
          900: '#12151F',
          950: '#0B0D14',
        },
        // Amber "keycard" accent — the primary signature color.
        brand: {
          50: '#FFF8EB',
          100: '#FFEDC7',
          200: '#FFDA8F',
          300: '#FFC257',
          400: '#FFB454',
          500: '#F59E1F',
          600: '#D97F0A',
          700: '#B3620A',
          800: '#8F4D10',
          900: '#753F10',
        },
        // Teal "access granted" secondary — used sparingly for success/live states.
        success: {
          50: '#EDFDF9',
          400: '#5EEAD4',
          500: '#2DD4BF',
          600: '#14B8A6',
        },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'led-pulse': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 0 0 rgba(94, 234, 212, 0.45)' },
          '50%': { opacity: 0.85, boxShadow: '0 0 0 6px rgba(94, 234, 212, 0)' },
        },
        'ticker-scroll': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        cycle: {
          '0%, 100%': { opacity: 0.35 },
          '16%': { opacity: 1 },
          '33%': { opacity: 1 },
          '50%': { opacity: 0.35 },
        },
        scan: {
          '0%': { transform: 'translateY(-120%)' },
          '50%': { transform: 'translateY(220%)' },
          '100%': { transform: 'translateY(220%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.5s ease both',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'led-pulse': 'led-pulse 2.4s ease-in-out infinite',
        'ticker-scroll': 'ticker-scroll 8s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'cycle-highlight': 'cycle 6s ease-in-out infinite',
        scan: 'scan 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
