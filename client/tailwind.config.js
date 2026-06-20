/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wc-navy': '#0a0e1a',
        'wc-deep': '#0d1530',
        'wc-blue': '#1a2a6c',
        'wc-gold': '#FFD700',
        'wc-gold-light': '#FFE44D',
        'wc-red': '#E63946',
        'wc-red-dark': '#c1121f',
        'wc-green': '#2d6a4f',
        'wc-surface': '#111827',
        'wc-card': '#1f2937',
        'wc-border': '#374151',
        'wc-muted': '#6b7280',
        'wc-text': '#f9fafb',
        'theme-bg': '#F9FAFB',
        'theme-deep': '#111827',
        'theme-primary': '#2563EB',
        'theme-secondary': '#10B981',
        'theme-highlight': '#8B5CF6',
        'theme-soft': '#DBEAFE',
      },
      fontFamily: {
        'display': ['Outfit', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'wc-gradient': 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)',
        'wc-gradient-dark': 'linear-gradient(135deg, #0a0e1a 0%, #1a2a6c 50%, #0a0e1a 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
        'card-gradient': 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 1.5s infinite',
        'bounce-subtle': 'bounceSubtle 0.3s ease-out',
        'float': 'float 15s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.2' },
          '50%': { transform: 'translateY(-30px) scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '0.2' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #FFD700, 0 0 10px #FFD700' },
          '100%': { boxShadow: '0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 80px #FFD700' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
      },
      boxShadow: {
        'gold': '0 0 20px rgba(255, 215, 0, 0.3)',
        'gold-lg': '0 0 40px rgba(255, 215, 0, 0.5)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
}
