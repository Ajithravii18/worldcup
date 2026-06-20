import { useState, useEffect } from 'react';

export default function HeroLanding() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after mount
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-8 bg-white border border-gray-200 shadow-md">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon fill="#2563EB" points="0,0 100,0 0,100" />
          <polygon fill="#10B981" points="100,100 100,0 0,100" />
        </svg>
      </div>

      <div className="relative z-10 px-6 py-12 md:py-16 flex flex-col items-center text-center">
        <div className={`transition-all duration-700 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-theme-primary text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
            Welcome to the Arena
          </span>
        </div>
        
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black font-display text-gray-900 tracking-tight mb-4 transition-all duration-700 delay-100 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          LUCKY STAR FC <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-primary to-theme-highlight">PREDICTIONS</span>
        </h1>
        
        <p className={`text-gray-600 max-w-xl text-sm md:text-base font-medium mb-8 transition-all duration-700 delay-200 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          Step onto the digital pitch. Predict real match scores, outsmart the community, climb the leaderboard, and claim ultimate glory.
        </p>

        <div className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-300 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 border border-gray-200 rounded-lg shadow-sm">
            <span className="text-2xl">🎯</span>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Predict Scores</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 border border-gray-200 rounded-lg shadow-sm">
            <span className="text-2xl">🏆</span>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Win Points</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 border border-gray-200 rounded-lg shadow-sm">
            <span className="text-2xl">💬</span>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Talk Trash</span>
          </div>
        </div>
      </div>
    </div>
  );
}
