/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY: Vivid orange-coral (main action color)
        primary: {
          50:  '#FFF4EE',
          100: '#FFE6D5',
          200: '#FFCAAA',
          300: '#FFA573',
          400: '#FF7B3A',
          500: '#FF6B35', // MAIN
          600: '#F04B10',
          700: '#C73A0A',
          800: '#9E3010',
          900: '#7F2C13',
        },
        // PURPLE: Magic/adventure secondary
        purple: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED', // MAIN
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        // SUCCESS: Bright green (correct answer)
        success: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E', // MAIN
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // ERROR: Red (wrong answer)
        error: {
          50:  '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E', // MAIN
          600: '#E11D48',
          700: '#BE123C',
        },
        // GOLD: Rewards/XP
        gold: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // MAIN
          600: '#D97706',
          700: '#B45309',
        },
        // BACKGROUND: Warm cream
        cream: {
          50:  '#FFFDF9',
          100: '#FFF8F0',
          200: '#FFF0E0',
        },
        // NEUTRALS
        ink: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0A0F1E',
        },
      },
      fontFamily: {
        display: ['Nunito', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        'primary': '0 4px 16px rgba(255,107,53,0.35)',
        'primary-lg': '0 8px 32px rgba(255,107,53,0.4)',
      },
      animation: {
        'bounce-sm': 'bounce 0.5s ease-in-out',
        'wiggle': 'wiggle 0.3s ease-in-out',
        'pop': 'pop 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
