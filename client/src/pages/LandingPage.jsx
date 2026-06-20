import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-4 bg-transparent">
      
      {/* Soft glowing orbs for premium feel */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-wc-blue/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-wc-gold/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <div className="relative z-10 max-w-lg w-full px-6 flex flex-col items-center text-center">
        {/* Branding matching Login */}
        <div className="mb-12 text-center relative z-10 opacity-0 animate-[slideUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.2s' }}>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-none tracking-[0.25em] font-black text-white drop-shadow-xl animate-pulse">
            LUCKY STAR FC
          </h1>
          <p className="text-sm sm:text-base text-wc-gold tracking-[0.4em] uppercase leading-none mt-4 font-bold">
            PREDICTIONS
          </p>

          {/* WC 2026 Badge */}
          <div className="mt-8 inline-flex items-center gap-2 bg-[#050810]/50 border border-white/10 px-6 py-3 rounded-none shadow-2xl backdrop-blur-sm">
            <span className="text-xl animate-bounce" style={{ animationDuration: '2s' }}>🏆</span>
            <span className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-[0.2em]">WORLD CUP 2026</span>
            <span className="text-white/20 mx-2">|</span>
            <span className="text-lg tracking-widest drop-shadow-md">🇨🇦 🇲🇽 🇺🇸</span>
          </div>
        </div>

        {/* Minimalistic Description */}
        <p className="text-white/60 text-sm sm:text-base font-medium leading-relaxed mb-12 px-4 opacity-0 animate-[slideUp_0.8s_ease-out_forwards] tracking-wide" style={{ animationDelay: '0.5s' }}>
          The ultimate prediction arena for the 2026 World Cup.
        </p>

        {/* Action Buttons */}
        <div className="w-full sm:w-4/5 flex flex-col gap-4 opacity-0 animate-[slideUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.8s' }}>
          <Link
            to="/login"
            className="w-full text-center bg-white text-black font-display font-bold py-4 rounded-none tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] border border-transparent"
          >
            Enter Arena
          </Link>
          
          <Link
            to="/register"
            className="w-full text-center bg-transparent text-white font-display font-bold py-4 rounded-none tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm border border-white/30 hover:border-white hover:bg-white/5"
          >
            Create Account
          </Link>
        </div>
      </div>
      
      {/* Bottom tagline */}
      <p className="absolute bottom-8 text-white/30 text-[10px] uppercase tracking-[0.3em] text-center z-10 opacity-0 animate-[fadeIn_1s_ease-out_forwards]" style={{ animationDelay: '1.2s' }}>
        Predict. Compete. Glory awaits.
      </p>
    </div>
  );
}
