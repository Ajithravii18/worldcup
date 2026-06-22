/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fm-bg':       '#051424', // Legacy name, new background
        'fm-surface':  '#122131', // Legacy name, new surface
        'fm-surface2': '#1c2b3c', // Legacy name, hover surface
        'fm-border':   'rgba(255, 255, 255, 0.1)',
        'fm-muted':    '#bccbb9', // on-surface-variant
        'fm-text':     '#d4e4fa', // on-background
        'fm-orange':   '#ec6a06', // secondary-container (Striker Orange)
        'fm-orange2':  '#ffb690', // secondary (hover)
        'fm-green':    '#4be277', // primary
        'fm-red':      '#ffb4ab', // error
        'fm-gold':     '#f59e0b', // top scorer
        
        // Stadium Pro Colors
        background: '#051424',
        surface: '#051424',
        'surface-dim': '#051424',
        'surface-bright': '#2c3a4c',
        'surface-container-lowest': '#010f1f',
        'surface-container-low': '#0d1c2d',
        'surface-container': '#122131',
        'surface-container-high': '#1c2b3c',
        'surface-container-highest': '#273647',
        'on-surface': '#d4e4fa',
        'on-surface-variant': '#bccbb9',
        'inverse-surface': '#d4e4fa',
        'inverse-on-surface': '#233143',
        outline: '#869585',
        'outline-variant': '#3d4a3d',
        'surface-tint': '#4ae176',
        primary: '#4be277',
        'on-primary': '#003915',
        'primary-container': '#22c55e',
        'on-primary-container': '#004b1e',
        'inverse-primary': '#006e2f',
        secondary: '#ffb690',
        'on-secondary': '#552100',
        'secondary-container': '#ec6a06',
        'on-secondary-container': '#4a1c00',
        tertiary: '#bfc6e0',
        'on-tertiary': '#283044',
        'tertiary-container': '#a4abc4',
        'on-tertiary-container': '#383f54',
        error: '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',
        'on-background': '#d4e4fa',

        // Legacy aliases
        'wc-navy':     '#051424',
        'wc-deep':     '#122131',
        'wc-gold':     '#f59e0b',
        'wc-text':     '#d4e4fa',
        'wc-muted':    '#bccbb9',
        'wc-border':   'rgba(255, 255, 255, 0.1)',
        'wc-surface':  '#122131',
        'theme-primary': '#4be277',
        'theme-secondary': '#ec6a06',
        'theme-bg':    '#051424',
        'theme-deep':  '#122131',
      },
      fontFamily: {
        'display': ['"Archivo Narrow"', 'sans-serif'],
        'body':    ['Inter', 'sans-serif'],
        'mono':    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
        'sm':   '0.125rem',
        DEFAULT: '0.25rem',
        'md':   '0.375rem',
        'lg':   '0.5rem',
        'xl':   '0.75rem',
        '2xl':  '1rem',
        'full': '9999px',
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
        'orange': '0 0 0 1px #ec6a06',
        'green': '0 0 0 2px #4be277',
        'card':   '0 4px 24px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
