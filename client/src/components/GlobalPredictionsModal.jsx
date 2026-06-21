import { useEffect, useState } from 'react';
import TeamFlag from './TeamFlag';
import UserAvatar from './UserAvatar';

/**
 * GlobalPredictionsModal — A bottom-sheet style popup showing global prediction stats
 * and individual user predictions with a game-like turf feel.
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
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
        animate ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Bottom Sheet Card */}
      <div
        className={`w-full max-w-lg rounded-t-[2rem] border-t border-gray-200 p-6 shadow-2xl relative overflow-hidden transition-transform duration-300 ${
          animate ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          background: '#ffffff',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Drag handle decoration */}
        <div className="w-12 h-1 bg-wc-border rounded-full mx-auto mb-5 opacity-40" />

        {/* Close Button */}
        <button
          onClick={handleCloseButton}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-wc-border/30 hover:bg-wc-border/60 flex items-center justify-center text-wc-muted hover:text-wc-text transition-colors text-sm font-bold"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-bold text-wc-gold uppercase tracking-widest bg-wc-gold/10 px-2.5 py-1 rounded-full border border-wc-gold/20">
            📊 MATCH STATISTICS
          </span>
          <div className="text-xs text-wc-muted mt-2">{match.group} • {match.venue}</div>
          <div className="text-xs text-wc-muted/80 font-semibold">{formattedKickoff}</div>
        </div>

        {/* Teams Duel Card */}
        <div className="flex items-center justify-between bg-wc-surface/50 border border-wc-border/30 rounded-none p-4 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-wc-gradient-dark opacity-10 -z-10" />
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center h-10 mb-1 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
              <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-11 h-8" />
            </div>
            <div className="font-display text-base text-wc-text tracking-wide truncate max-w-[120px] mx-auto">{match.homeTeam}</div>
          </div>
          
          <div className="px-4 text-center">
            {match.status === 'completed' ? (
              <div className="font-display text-3xl text-wc-gold bg-gray-50 px-3 py-1 rounded-none border border-wc-gold/20">
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div className="font-display text-2xl text-wc-muted italic">VS</div>
            )}
          </div>

          <div className="flex-1 text-center">
            <div className="flex items-center justify-center h-10 mb-1 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
              <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-11 h-8" />
            </div>
            <div className="font-display text-base text-wc-text tracking-wide truncate max-w-[120px] mx-auto">{match.awayTeam}</div>
          </div>
        </div>

        {/* Percentage Stats Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs text-wc-muted uppercase tracking-widest font-bold mb-2">
            <span>Prediction Voting %</span>
            <span className="text-wc-gold">{totalPreds} total prediction{totalPreds !== 1 ? 's' : ''}</span>
          </div>

          {totalPreds > 0 ? (
            <div>
              {/* Multi-segment animated bar */}
              <div className="w-full bg-wc-border/30 h-4 rounded-full overflow-hidden flex border border-wc-border/40 shadow-inner">
                <div
                  style={{ width: `${animate ? homePct : 0}%` }}
                  className="bg-gradient-to-r from-emerald-600 to-green-400 transition-all duration-1000 ease-out h-full relative"
                  title={`Home Win: ${homePct}%`}
                />
                <div
                  style={{ width: `${animate ? drawPct : 0}%` }}
                  className="bg-gray-500 transition-all duration-1000 ease-out h-full"
                  title={`Draw: ${drawPct}%`}
                />
                <div
                  style={{ width: `${animate ? awayPct : 0}%` }}
                  className="bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-1000 ease-out h-full"
                  title={`Away Win: ${awayPct}%`}
                />
              </div>

              {/* Percent Legend */}
              <div className="flex justify-between mt-3 text-xs font-semibold px-1">
                <div className="flex items-center gap-1.5 text-green-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span>{match.homeTeam}: {homePct}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                  <span>Draw: {drawPct}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>{match.awayTeam}: {awayPct}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 bg-wc-surface/30 border border-dashed border-wc-border/50 rounded-none text-wc-muted text-sm">
              🎯 No predictions submitted yet. Make yours!
            </div>
          )}
        </div>

        {/* Global Predictions List */}
        <div>
          <div className="text-xs text-wc-muted uppercase tracking-widest font-bold mb-3">
            📋 Prediction Leaderboard ({predictions.length})
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {predictions.length > 0 ? (
              predictions.map((pred, idx) => {
                const isHomeWin = pred.homeGoals > pred.awayGoals;
                const isAwayWin = pred.awayGoals > pred.homeGoals;
                
                return (
                  <div
                    key={pred._id}
                    className="flex items-center justify-between bg-wc-surface/40 hover:bg-wc-surface/70 border border-wc-border/30 rounded-none px-4 py-2.5 transition-all duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-wc-muted w-4">
                        #{idx + 1}
                      </span>
                      <UserAvatar avatarId={pred.user?.avatar} className="w-7 h-7 text-xs border-2" />
                      <span className="text-sm text-wc-text font-medium truncate max-w-[150px]">
                        {pred.user?.name || 'Anonymous User'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Badge showing who they predicted to win */}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isHomeWin ? 'bg-green-900/30 text-green-400 border border-green-700/30' :
                        isAwayWin ? 'bg-red-900/30 text-red-400 border border-red-700/30' :
                        'bg-gray-800/50 text-gray-300 border border-gray-700/30'
                      }`}>
                        {isHomeWin ? 'Home Win' : isAwayWin ? 'Away Win' : 'Draw'}
                      </span>
                      <span className="font-display text-xl text-wc-gold bg-gray-50 px-3 py-1 rounded-none border border-wc-border/30 min-w-[50px] text-center">
                        {pred.homeGoals} – {pred.awayGoals}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-wc-muted text-sm py-4">
                No active predictions.
              </div>
            )}
          </div>
        </div>

        {/* Modal footer action */}
        <div className="mt-6">
          <button
            onClick={handleCloseButton}
            className="w-full py-3 bg-wc-border/50 text-wc-text hover:bg-wc-border/80 rounded-none text-sm font-semibold transition-colors border border-wc-border"
          >
            Back to Match Feed
          </button>
        </div>
      </div>
    </div>
  );
}
