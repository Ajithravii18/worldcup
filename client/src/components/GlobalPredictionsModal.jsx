import { useEffect, useState } from 'react';
import TeamFlag from './TeamFlag';
import UserAvatar from './UserAvatar';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalPredictionsModal({ isOpen, onClose, match, predictions = [] }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPreds = predictions.length;
  let homeWins = 0, draws = 0, awayWins = 0;
  predictions.forEach((p) => {
    if (p.homeGoals > p.awayGoals) homeWins++;
    else if (p.homeGoals === p.awayGoals) draws++;
    else awayWins++;
  });

  const homePct = totalPreds > 0 ? Math.round((homeWins / totalPreds) * 100) : 0;
  const drawPct = totalPreds > 0 ? Math.round((draws / totalPreds) * 100) : 0;
  const awayPct = totalPreds > 0 ? Math.round((awayWins / totalPreds) * 100) : 0;

  const formattedKickoff = new Date(match.kickoffTime).toLocaleString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
  });

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-none rounded-3xl p-6 relative bg-black/80 backdrop-blur-2xl shadow-2xl border border-white/20"
          >

            <button
              onClick={onClose}
              className="absolute right-6 top-6 w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/20 flex items-center justify-center text-outline-variant hover:text-white transition-colors text-sm font-bold z-10 backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="text-center mb-8 mt-2">
              <span className="font-display text-xs font-black text-primary uppercase tracking-[0.2em] bg-primary/20 px-4 py-1.5 rounded border border-primary/50 shadow-neon-primary">
                <span className="material-symbols-outlined text-[16px] mr-2 align-text-bottom">bar_chart</span> MATCH STATISTICS
              </span>
              <div className="text-sm text-white mt-5 font-display font-bold tracking-wide uppercase">{match.group} • {match.venue}</div>
              <div className="text-xs text-outline-variant font-display tracking-widest mt-1 font-bold">{formattedKickoff}</div>
            </div>

            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 relative overflow-hidden shadow-inner backdrop-blur-md">
              <div className="flex-1 text-center flex flex-col items-center">
                <div className="w-20 h-14 rounded-xl bg-black border border-white/20 flex items-center justify-center overflow-hidden shadow-md mb-3 -skew-x-6">
                  <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover skew-x-6" />
                </div>
                <div className="font-display text-base text-white font-black tracking-wide uppercase truncate w-full">{match.homeTeam}</div>
              </div>
              
              <div className="px-4 text-center">
                {match.status === 'completed' ? (
                  <div className="font-display text-4xl font-black text-primary bg-black/50 px-5 py-2 border border-white/20 rounded-xl shadow-inner">
                    {match.homeScore} - {match.awayScore}
                  </div>
                ) : (
                  <div className="font-display text-3xl font-black text-outline-variant italic">VS</div>
                )}
              </div>

              <div className="flex-1 text-center flex flex-col items-center">
                <div className="w-20 h-14 rounded-xl bg-black border border-white/20 flex items-center justify-center overflow-hidden shadow-md mb-3 -skew-x-6">
                  <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover skew-x-6" />
                </div>
                <div className="font-display text-base text-white font-black tracking-wide uppercase truncate w-full">{match.awayTeam}</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center font-display font-bold text-[10px] sm:text-xs text-outline-variant uppercase tracking-[0.2em] mb-3">
                <span>Prediction Voting</span>
                <span className="text-primary">{totalPreds} total preds</span>
              </div>

              {totalPreds > 0 ? (
                <div>
                  <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden flex border border-white/10 shadow-inner">
                    {homePct > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${homePct}%` }} transition={{ duration: 1 }} className="bg-secondary h-full shadow-[0_0_8px_rgba(0,255,135,0.5)]" />}
                    {drawPct > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${drawPct}%` }} transition={{ duration: 1 }} className="bg-white/40 h-full" />}
                    {awayPct > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${awayPct}%` }} transition={{ duration: 1 }} className="bg-[#ff3d00] h-full shadow-[0_0_8px_rgba(255,61,0,0.5)]" />}
                  </div>
                  <div className="flex justify-between mt-3 text-[10px] sm:text-xs font-display font-bold px-1 uppercase tracking-widest">
                    <div className="flex items-center gap-2 text-secondary drop-shadow-[0_0_5px_rgba(0,255,135,0.4)]"><span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_5px_rgba(0,255,135,0.5)]" /><span>{match.homeTeam}: {homePct}%</span></div>
                    <div className="flex items-center gap-2 text-white/60"><span className="w-2.5 h-2.5 rounded-full bg-white/40" /><span>Draw: {drawPct}%</span></div>
                    <div className="flex items-center gap-2 text-[#ff3d00] drop-shadow-[0_0_5px_rgba(255,61,0,0.4)]"><span className="w-2.5 h-2.5 rounded-full bg-[#ff3d00] shadow-[0_0_5px_rgba(255,61,0,0.5)]" /><span>{match.awayTeam}: {awayPct}%</span></div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-white/5 border border-dashed border-white/20 rounded-2xl text-outline-variant text-[10px] sm:text-xs font-display font-bold uppercase tracking-[0.2em]">
                  NO PREDICTIONS YET. BE THE FIRST.
                </div>
              )}
            </div>

            <div>
              <div className="font-display font-bold text-[10px] sm:text-xs text-outline-variant uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">list_alt</span> PREDICTION LEADERBOARD ({predictions.length})
              </div>

              <div className="max-h-56 overflow-y-auto space-y-3 pr-2 scrollbar-none">
                {predictions.length > 0 ? (
                  predictions.map((pred, idx) => {
                    const isHomeWin = pred.homeGoals > pred.awayGoals;
                    const isAwayWin = pred.awayGoals > pred.homeGoals;
                    
                    return (
                      <div key={pred._id} className="flex items-center justify-between bg-white/5 rounded-xl px-5 py-3 shadow-inner border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="font-display text-lg font-black text-outline-variant w-4">{idx + 1}</span>
                          <UserAvatar avatarId={pred.user?.avatar} className="w-10 h-10 flex-shrink-0 border border-white/20 rounded-full object-cover shadow-sm bg-black" />
                          <span className="text-sm sm:text-base text-white font-display font-black truncate max-w-[150px] uppercase tracking-widest">{pred.user?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`font-display font-bold text-[10px] px-3 py-1 rounded border uppercase tracking-widest hidden sm:block ${
                            isHomeWin ? 'bg-secondary/20 text-secondary border-secondary/50' :
                            isAwayWin ? 'bg-[#ff3d00]/20 text-[#ff3d00] border-[#ff3d00]/50' :
                            'bg-white/10 text-outline-variant border-white/20'
                          }`}>
                            {isHomeWin ? 'Home Win' : isAwayWin ? 'Away Win' : 'Draw'}
                          </span>
                          <span className="font-display text-xl sm:text-2xl font-black tracking-widest text-primary bg-black/50 px-4 py-1.5 rounded-lg border border-white/10 shadow-inner">
                            {pred.homeGoals} - {pred.awayGoals}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-outline-variant text-[10px] sm:text-xs py-6 font-display font-bold uppercase tracking-widest">
                    No active predictions.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
