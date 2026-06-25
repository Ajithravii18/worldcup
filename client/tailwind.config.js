/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#F8FAFC",
          primary: "#2563EB",
          secondary: "#1D4ED8",
          success: "#16A34A",
          danger: "#DC2626",
          ink: "#0F172A",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 40px rgba(15, 23, 42, 0.08)",
        soft: "0 12px 28px rgba(37, 99, 235, 0.12)",
      },
      borderRadius: {
        app: "1.5rem",
      },
    },
  },
  plugins: [],
};
