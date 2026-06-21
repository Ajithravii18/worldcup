/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FotMob-inspired palette
        'fm-bg':       '#141921',   // page background
        'fm-surface':  '#1e2636',   // card surface
        'fm-surface2': '#253049',   // card hover / elevated
        'fm-border':   '#2a3347',   // border
        'fm-muted':    '#6b7280',   // muted text
        'fm-text':     '#f0f0f0',   // primary text
        'fm-orange':   '#F26522',   // primary accent (FotMob orange)
        'fm-orange2':  '#e05a14',   // darker orange for hover
        'fm-green':    '#22c55e',   // success / correct prediction
        'fm-red':      '#ef4444',   // live / danger
        'fm-gold':     '#f59e0b',   // top scorer / trophy
        // Legacy aliases kept for existing components
        'wc-navy':     '#141921',
        'wc-deep':     '#1e2636',
        'wc-gold':     '#f59e0b',
        'theme-primary': '#F26522',
        'theme-secondary': '#22c55e',
        'theme-bg':    '#141921',
        'theme-deep':  '#1e2636',
      },
      fontFamily: {
        'display': ['Outfit', 'sans-serif'],
        'body':    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'none': '0px',
        'sm':   '2px',   // max allowed — keeps FotMob feel
        DEFAULT: '2px',
        'md':   '2px',
        'lg':   '2px',
        'xl':   '2px',
        '2xl':  '2px',
        'full': '9999px', // only for avatars / pills where explicitly needed
      },
      animation: {
        'pulse-slow':    'pulse 3s ease-in-out infinite',
        'slide-up':      'slideUp 0.3s ease-out',
        'fade-in':       'fadeIn 0.25s ease-out',
        'shimmer':       'shimmer 1.5s infinite',
        'bounce-subtle': 'bounceSubtle 0.3s ease-out',
        'spin':          'spin 0.8s linear infinite',
      },
      keyframes: {
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(0.96)' },
        },
      },
      boxShadow: {
        'orange': '0 0 0 1px #F26522',
        'card':   '0 2px 12px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
