import { useEffect, useState } from 'react';
import TeamFlag from './TeamFlag';
import UserAvatar from './UserAvatar';

/**
 * GlobalPredictionsModal — A bottom-sheet style popup showing global prediction stats
 * and individual user predictions with a premium broadcast feel.
 */
export default function GlobalPredictionsModal({ isOpen, onClose, match, predictions = [] }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => {
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = '';
      setAnimate(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Compute prediction vote statistics
  const totalPreds = predictions.length;
  let homeWins = 0;
  let draws = 0;
  let awayWins = 0;

  predictions.forEach((p) => {
    if (p.homeGoals > p.awayGoals) homeWins++;
    else if (p.homeGoals === p.awayGoals) draws++;
    else awayWins++;
  });

  const homePct = totalPreds > 0 ? Math.round((homeWins / totalPreds) * 100) : 0;
  const drawPct = totalPreds > 0 ? Math.round((draws / totalPreds) * 100) : 0;
  const awayPct = totalPreds > 0 ? Math.round((awayWins / totalPreds) * 100) : 0;

  // Kickoff time formatted
  const formattedKickoff = new Date(match.kickoffTime).toLocaleString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setAnimate(false);
      setTimeout(onClose, 250);
    }
  };

  const handleCloseButton = () => {
    setAnimate(false);
    setTimeout(onClose, 250);
  };

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
        animate ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Bottom Sheet Card */}
      <div
        className={`w-full max-w-lg rounded-t-[1.5rem] border-t border-white/10 p-6 relative overflow-hidden transition-transform duration-300 ${
          animate ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          background: 'rgba(5, 20, 36, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Drag handle decoration */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />

        {/* Close Button */}
        <button
          onClick={handleCloseButton}
          className="absolute right-5 top-5 w-8 h-8 rounded border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-fm-muted hover:text-white transition-colors text-sm font-bold"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-mono font-bold text-fm-gold uppercase tracking-widest bg-fm-gold/10 px-2.5 py-1 rounded-full border border-fm-gold/20">
            📊 MATCH STATISTICS
          </span>
          <div className="text-xs text-fm-muted mt-3 font-mono tracking-wide">{match.group} • {match.venue}</div>
          <div className="text-xs text-white/60 font-mono tracking-widest mt-1">{formattedKickoff}</div>
        </div>

        {/* Teams Duel Card */}
        <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded-lg p-4 mb-6 relative overflow-hidden">
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center h-10 mb-2 drop-shadow-md">
              <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-11 h-8" />
            </div>
            <div className="font-display text-base text-white font-bold tracking-wide truncate max-w-[120px] mx-auto">{match.homeTeam}</div>
          </div>
          
          <div className="px-4 text-center">
            {match.status === 'completed' ? (
              <div className="font-mono text-3xl font-bold text-white bg-white/5 px-3 py-1 border border-white/10 rounded">
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div className="font-display text-2xl font-black text-white/20 italic tracking-wider">VS</div>
            )}
          </div>

          <div className="flex-1 text-center">
            <div className="flex items-center justify-center h-10 mb-2 drop-shadow-md">
              <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-11 h-8" />
            </div>
            <div className="font-display text-base text-white font-bold tracking-wide truncate max-w-[120px] mx-auto">{match.awayTeam}</div>
          </div>
        </div>

        {/* Percentage Stats Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-[10px] text-fm-muted uppercase font-mono tracking-widest mb-2">
            <span>Prediction Voting %</span>
            <span className="text-fm-gold">{totalPreds} total prediction{totalPreds !== 1 ? 's' : ''}</span>
          </div>

          {totalPreds > 0 ? (
            <div>
              {/* Multi-segment animated bar */}
              <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden flex border border-white/5">
                <div
                  style={{ width: `${animate ? homePct : 0}%` }}
                  className="bg-fm-green transition-all duration-1000 ease-out h-full relative"
                  title={`Home Win: ${homePct}%`}
                />
                <div
                  style={{ width: `${animate ? drawPct : 0}%` }}
                  className="bg-white/20 transition-all duration-1000 ease-out h-full"
                  title={`Draw: ${drawPct}%`}
                />
                <div
                  style={{ width: `${animate ? awayPct : 0}%` }}
                  className="bg-fm-orange transition-all duration-1000 ease-out h-full"
                  title={`Away Win: ${awayPct}%`}
                />
              </div>

              {/* Percent Legend */}
              <div className="flex justify-between mt-3 text-xs font-mono font-medium px-1">
                <div className="flex items-center gap-1.5 text-fm-green">
                  <span className="w-2 h-2 rounded-full bg-fm-green drop-shadow-[0_0_4px_rgba(75,226,119,0.8)]" />
                  <span>{match.homeTeam}: {homePct}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/50">
                  <span className="w-2 h-2 rounded-full bg-white/30" />
                  <span>Draw: {drawPct}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-fm-orange">
                  <span className="w-2 h-2 rounded-full bg-fm-orange drop-shadow-[0_0_4px_rgba(236,106,6,0.8)]" />
                  <span>{match.awayTeam}: {awayPct}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 bg-white/5 border border-dashed border-white/20 rounded text-fm-muted text-xs font-mono">
              🎯 No predictions submitted yet. Make yours!
            </div>
          )}
        </div>

        {/* Global Predictions List */}
        <div>
          <div className="text-[10px] text-fm-muted font-mono uppercase tracking-widest mb-3">
            📋 Prediction Leaderboard ({predictions.length})
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-none">
            {predictions.length > 0 ? (
              predictions.map((pred, idx) => {
                const isHomeWin = pred.homeGoals > pred.awayGoals;
                const isAwayWin = pred.awayGoals > pred.homeGoals;
                
                return (
                  <div
                    key={pred._id}
                    className="flex items-center justify-between glass-card px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-white/40 w-4">
                        #{idx + 1}
                      </span>
                      <UserAvatar avatarId={pred.user?.avatar} className="w-7 h-7 text-xs border border-white/20 rounded-full" />
                      <span className="text-sm font-display font-bold text-white truncate max-w-[150px]">
                        {pred.user?.name || 'Anonymous User'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase border ${
                        isHomeWin ? 'bg-fm-green/10 text-fm-green border-fm-green/30' :
                        isAwayWin ? 'bg-fm-orange/10 text-fm-orange border-fm-orange/30' :
                        'bg-white/5 text-fm-muted border-white/10'
                      }`}>
                        {isHomeWin ? 'Home Win' : isAwayWin ? 'Away Win' : 'Draw'}
                      </span>
                      <span className="font-mono text-lg font-bold text-white bg-black/40 px-3 py-1 rounded border border-white/10 min-w-[54px] text-center">
                        {pred.homeGoals} – {pred.awayGoals}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-fm-muted text-xs py-4 font-mono">
                No active predictions.
              </div>
            )}
          </div>
        </div>

        {/* Modal footer action */}
        <div className="mt-6">
          <button
            onClick={handleCloseButton}
            className="w-full py-3 bg-white/5 text-white hover:bg-white/10 border border-white/20 rounded font-display font-bold uppercase tracking-widest text-xs transition-colors"
          >
            Back to Match Feed
          </button>
        </div>
      </div>
    </div>
  );
}
