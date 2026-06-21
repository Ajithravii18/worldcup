import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{ background: '#f8fafc' }}
    >
      {/* Subtle orange glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(242,101,34,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-sm w-full flex flex-col items-center text-center">

        {/* Logo */}
        <div
          className="mb-6 opacity-0 animate-[slideUp_0.6s_ease-out_0.1s_forwards]"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-12 h-12 flex items-center justify-center font-black text-white text-3xl font-display"
              style={{ background: '#F26522' }}
            >
              K
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-[0.2em] uppercase" style={{ color: '#0f172a' }}>
              Lucky Star FC
            </h1>
          </div>
          <p className="text-xs tracking-[0.45em] uppercase font-black" style={{ color: '#F26522' }}>
            World Cup 2026 Predictions
          </p>
        </div>

        {/* Badge */}
        <div
          className="mb-10 flex items-center gap-3 px-5 py-2.5 opacity-0 animate-[slideUp_0.6s_ease-out_0.3s_forwards]"
          style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
        >
          <span className="text-lg animate-bounce" style={{ animationDuration: '2.5s' }}>🏆</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#0f172a' }}>World Cup 2026</span>
          <span style={{ color: '#e2e8f0' }}>|</span>
          <span className="text-base tracking-widest">🇨🇦 🇲🇽 🇺🇸</span>
        </div>

        {/* Tagline */}
        <p
          className="text-sm font-medium leading-relaxed mb-10 px-2 opacity-0 animate-[slideUp_0.6s_ease-out_0.5s_forwards]"
          style={{ color: '#6b7280' }}
        >
          The ultimate prediction arena for the 2026 World Cup.
        </p>

        {/* Buttons */}
        <div
          className="w-full flex flex-col gap-3 opacity-0 animate-[slideUp_0.6s_ease-out_0.7s_forwards]"
        >
          <Link
            to="/login"
            className="w-full text-center text-white font-display font-black py-4 tracking-[0.2em] uppercase transition-all duration-150 active:scale-95"
            style={{ background: '#F26522' }}
            onMouseEnter={e => e.currentTarget.style.background = '#e05a14'}
            onMouseLeave={e => e.currentTarget.style.background = '#F26522'}
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="w-full text-center font-display font-black py-4 tracking-[0.2em] uppercase transition-all duration-150 active:scale-95"
            style={{ background: 'transparent', border: '1.5px solid #F26522', color: '#F26522' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(242,101,34,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Create Account
          </Link>
        </div>
      </div>

      <p
        className="absolute bottom-8 text-[10px] uppercase tracking-[0.3em] text-center z-10 opacity-0 animate-[fadeIn_1s_ease-out_1.2s_forwards]"
        style={{ color: '#cbd5e1' }}
      >
        Predict · Compete · Glory
      </p>
    </div>
  );
}
