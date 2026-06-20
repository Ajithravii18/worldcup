import React from 'react';

export default function BottomNav({ view, setView, statusFilter, setStatusFilter }) {
  const isMatchesView = view === 'global' || view === 'my';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-40 px-4 pb-4 pt-0 pointer-events-none">
      <div className="max-w-lg mx-auto w-full flex flex-col gap-3 pointer-events-auto">
        
        {/* Secondary Navigation (Filter) - Only visible when in Matches Views */}
        {isMatchesView && (
          <div className="flex p-1 bg-[#050810]/80 backdrop-blur-md border border-white/10 rounded-none shadow-2xl mx-4 mb-1 animate-slide-up">
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`flex-1 py-2 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
                statusFilter === 'upcoming'
                  ? 'bg-white text-black shadow-md font-black'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              PREDICT OPEN
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`flex-1 py-2 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
                statusFilter === 'completed'
                  ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] font-black'
                  : 'text-emerald-400 bg-emerald-500/10 border-l border-emerald-500/30 hover:bg-emerald-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]'
              }`}
            >
              <span className={statusFilter !== 'completed' ? 'animate-pulse inline-block' : ''}>🏆 RESULTS</span>
            </button>
          </div>
        )}

        {/* Primary Bottom Navigation */}
        <div className="flex bg-[#050810]/90 backdrop-blur-xl border border-white/10 rounded-none p-1.5 shadow-2xl relative">
          <button
            onClick={() => setView('global')}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-none transition-all duration-300 ${
              view === 'global'
                ? 'bg-white/10 text-white scale-100 shadow-sm'
                : 'text-white/40 hover:text-white hover:bg-white/5 scale-95'
            }`}
          >
            <span className="text-xl mb-1">🌍</span>
            <span className="text-[9px] font-black uppercase tracking-widest">GLOBAL</span>
          </button>

          <button
            onClick={() => setView('my')}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-none transition-all duration-300 ${
              view === 'my'
                ? 'bg-white/10 text-white scale-100 shadow-sm'
                : 'text-white/40 hover:text-white hover:bg-white/5 scale-95'
            }`}
          >
            <span className="text-xl mb-1">👤</span>
            <span className="text-[9px] font-black uppercase tracking-widest">MY PREDS</span>
          </button>

          <button
            onClick={() => setView('leaderboard')}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-none transition-all duration-300 ${
              view === 'leaderboard'
                ? 'bg-white/10 text-white scale-100 shadow-sm'
                : 'text-white/40 hover:text-white hover:bg-white/5 scale-95'
            }`}
          >
            <span className="text-xl mb-1">👥</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-center leading-none mt-0.5">PLAYERS &<br/>PREDS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
