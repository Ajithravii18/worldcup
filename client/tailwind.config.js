/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        error: "#ba1a1a",
        "on-primary": "#ffffff",
        "primary-fixed-dim": "#bcc3ff",
        "tertiary-fixed-dim": "#ffb5a0",
        "secondary-fixed-dim": "#88d982",
        "primary-fixed": "#dfe0ff",
        "outline-variant": "#c5c5d7",
        "primary-container": "#0020b2",
        "surface-bright": "#fcf9f8",
        "surface-container-lowest": "#ffffff",
        "error-container": "#ffdad6",
        "inverse-on-surface": "#f3f0ef",
        "surface-container": "#f0edec",
        "on-primary-fixed-variant": "#1b32be",
        "surface-variant": "#e5e2e1",
        "tertiary-fixed": "#ffdbd1",
        "on-primary-container": "#8f9dff",
        "on-secondary": "#ffffff",
        "on-tertiary-fixed": "#3b0900",
        "surface-container-low": "#f6f3f2",
        "inverse-primary": "#bcc3ff",
        "on-secondary-fixed": "#002204",
        "on-error": "#ffffff",
        "surface": "#fcf9f8",
        "surface-container-highest": "#e5e2e1",
        "surface-tint": "#3a4ed5",
        "inverse-surface": "#313030",
        "on-background": "#1c1b1b",
        "on-tertiary-fixed-variant": "#862200",
        "on-primary-fixed": "#000d60",
        "on-error-container": "#93000a",
        primary: "#001278",
        background: "#fcf9f8",
        secondary: "#1b6d24",
        "surface-container-high": "#ebe7e7",
        "secondary-container": "#a0f399",
        "on-secondary-container": "#217128",
        "on-surface": "#1c1b1b",
        "secondary-fixed": "#a3f69c",
        "surface-dim": "#dcd9d9",
        "on-surface-variant": "#454654",
        "tertiary-container": "#701b00",
        "on-tertiary": "#ffffff",
        outline: "#757686",
        "on-tertiary-container": "#ff7f59",
        "on-secondary-fixed-variant": "#005312",
        tertiary: "#4a0f00"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.125rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      fontFamily: {
        "display-lg": ["Archivo Narrow", "sans-serif"],
        "headline-lg": ["Archivo Narrow", "sans-serif"],
        "headline-lg-mobile": ["Archivo Narrow", "sans-serif"],
        "headline-md": ["Archivo Narrow", "sans-serif"],
        "label-md": ["Archivo Narrow", "sans-serif"],
        "label-sm": ["Archivo Narrow", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display": ["Archivo Narrow", "sans-serif"],
        "mono": ["Archivo Narrow", "monospace"], // Fallback if still using font-mono
      },
      boxShadow: {
        'subtle-card': '0 4px 12px rgba(0, 32, 178, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
