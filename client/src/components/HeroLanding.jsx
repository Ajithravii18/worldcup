import { useState, useEffect } from 'react';

export default function HeroLanding() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after mount
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-8 border border-outline-variant/50 shadow-subtle-card bg-surface-container-lowest">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001278]/40 to-[#00ff87]/10 z-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary opacity-[0.15] blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ff3d00] opacity-[0.1] blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="relative z-10 px-6 py-16 md:py-20 flex flex-col items-center text-center">
        <div className={`transition-all duration-700 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary font-label-md text-sm tracking-[0.2em] uppercase mb-4 shadow-neon-primary">
            Welcome to the Arena
          </span>
        </div>
        
        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black font-display-lg text-on-surface tracking-wide mb-2 transition-all duration-700 delay-100 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} drop-shadow-lg`}>
          LUCKY STAR FC <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#00a859] drop-shadow-[0_0_15px_rgba(0,255,135,0.4)]">PREDICTIONS</span>
        </h1>
        
        <p className={`text-on-surface-variant max-w-2xl text-base md:text-lg font-body-md mb-10 transition-all duration-700 delay-200 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          Step onto the digital pitch. Predict real match scores, outsmart the community, climb the leaderboard, and claim ultimate glory in the world's biggest tournament.
        </p>

        <div className={`flex flex-wrap items-center justify-center gap-4 md:gap-6 transition-all duration-700 delay-300 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center gap-3 bg-surface-container-low/50 backdrop-blur-md px-5 py-3 border border-outline-variant/50 rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-primary text-[28px]">sports_soccer</span>
            <span className="font-label-md text-sm text-on-surface uppercase tracking-widest mt-0.5">Predict Scores</span>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-low/50 backdrop-blur-md px-5 py-3 border border-outline-variant/50 rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-secondary text-[28px]">trophy</span>
            <span className="font-label-md text-sm text-on-surface uppercase tracking-widest mt-0.5">Win Points</span>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-low/50 backdrop-blur-md px-5 py-3 border border-outline-variant/50 rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-[#ff3d00] text-[28px]">social_leaderboard</span>
            <span className="font-label-md text-sm text-on-surface uppercase tracking-widest mt-0.5">Dominate Rankings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
