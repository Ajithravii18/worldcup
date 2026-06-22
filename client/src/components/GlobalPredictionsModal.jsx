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
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        animate ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Bottom Sheet Card */}
      <div
        className={`w-full max-w-lg rounded-t-[1.5rem] border-t border-outline-variant p-6 relative overflow-hidden transition-transform duration-300 bg-surface-container-lowest subtle-card-shadow ${
          animate ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle decoration */}
        <div className="w-12 h-1 bg-outline-variant rounded-full mx-auto mb-5" />

        {/* Close Button */}
        <button
          onClick={handleCloseButton}
          className="absolute right-5 top-5 w-8 h-8 rounded border border-outline-variant bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors text-sm font-bold"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="font-label-sm text-[10px] font-bold text-primary uppercase tracking-widest bg-primary-fixed px-3 py-1.5 rounded-full border border-primary-fixed-dim">
            <span className="material-symbols-outlined text-[12px] mr-1 align-text-bottom">bar_chart</span> MATCH STATISTICS
          </span>
          <div className="text-xs text-on-surface-variant mt-4 font-label-md tracking-wide">{match.group} • {match.venue}</div>
          <div className="text-xs text-on-surface-variant font-label-sm tracking-widest mt-1">{formattedKickoff}</div>
        </div>

        {/* Teams Duel Card */}
        <div className="flex items-center justify-between bg-surface-container-low border border-outline-variant rounded-xl p-4 mb-6 relative overflow-hidden shadow-sm">
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center h-10 mb-2">
              <div className="w-12 h-12 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shadow-sm">
                 <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-8 h-8 object-contain" />
              </div>
            </div>
            <div className="font-headline-md text-sm text-on-surface font-bold tracking-wide truncate max-w-[120px] mx-auto mt-2">{match.homeTeam}</div>
          </div>
          
          <div className="px-4 text-center">
            {match.status === 'completed' ? (
              <div className="font-display-lg text-3xl font-bold text-on-surface bg-surface px-3 py-1 border border-outline-variant rounded">
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div className="font-headline-md text-2xl font-black text-outline-variant italic tracking-wider">VS</div>
            )}
          </div>

          <div className="flex-1 text-center">
            <div className="flex items-center justify-center h-10 mb-2">
               <div className="w-12 h-12 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden shadow-sm">
                 <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-8 h-8 object-contain" />
               </div>
            </div>
            <div className="font-headline-md text-sm text-on-surface font-bold tracking-wide truncate max-w-[120px] mx-auto mt-2">{match.awayTeam}</div>
          </div>
        </div>

        {/* Percentage Stats Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">
            <span>Prediction Voting %</span>
            <span className="text-primary">{totalPreds} total prediction{totalPreds !== 1 ? 's' : ''}</span>
          </div>

          {totalPreds > 0 ? (
            <div>
              {/* Multi-segment animated bar */}
              <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden flex border border-outline-variant">
                <div
                  style={{ width: `${animate ? homePct : 0}%` }}
                  className="bg-secondary transition-all duration-1000 ease-out h-full relative"
                  title={`Home Win: ${homePct}%`}
                />
                <div
                  style={{ width: `${animate ? drawPct : 0}%` }}
                  className="bg-outline transition-all duration-1000 ease-out h-full"
                  title={`Draw: ${drawPct}%`}
                />
                <div
                  style={{ width: `${animate ? awayPct : 0}%` }}
                  className="bg-[#ff5a00] transition-all duration-1000 ease-out h-full"
                  title={`Away Win: ${awayPct}%`}
                />
              </div>

              {/* Percent Legend */}
              <div className="flex justify-between mt-3 text-xs font-label-sm px-1">
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span>{match.homeTeam}: {homePct}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-outline-variant" />
                  <span>Draw: {drawPct}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#ff5a00]">
                  <span className="w-2 h-2 rounded-full bg-[#ff5a00]" />
                  <span>{match.awayTeam}: {awayPct}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 bg-surface border border-dashed border-outline-variant rounded-lg text-on-surface-variant text-xs font-label-md">
              🎯 No predictions submitted yet. Make yours!
            </div>
          )}
        </div>

        {/* Global Predictions List */}
        <div>
          <div className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
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
                    className="flex items-center justify-between bg-surface border border-outline-variant rounded-lg px-4 py-2.5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-label-sm text-[10px] text-on-surface-variant w-4">
                        #{idx + 1}
                      </span>
                      <UserAvatar avatarId={pred.user?.avatar} className="w-8 h-8 text-xs border border-outline-variant rounded-full object-cover" />
                      <span className="text-sm font-headline-md font-bold text-on-surface truncate max-w-[150px]">
                        {pred.user?.name || 'Anonymous User'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-label-sm text-[9px] px-2 py-0.5 rounded uppercase border ${
                        isHomeWin ? 'bg-[#e6f4ea] text-[#1e4620] border-[#a3f69c]' :
                        isAwayWin ? 'bg-[#ffdbd1] text-[#93000a] border-[#ffb5a0]' :
                        'bg-surface-container text-on-surface-variant border-outline-variant'
                      }`}>
                        {isHomeWin ? 'Home Win' : isAwayWin ? 'Away Win' : 'Draw'}
                      </span>
                      <span className="font-display-lg text-lg font-bold text-on-surface bg-surface-container-lowest px-3 py-1 rounded border border-outline-variant min-w-[54px] text-center tracking-tighter">
                        {pred.homeGoals} – {pred.awayGoals}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-on-surface-variant text-xs py-4 font-label-md">
                No active predictions.
              </div>
            )}
          </div>
        </div>

        {/* Modal footer action */}
        <div className="mt-6">
          <button
            onClick={handleCloseButton}
            className="w-full py-3 bg-surface text-primary border border-outline-variant hover:bg-surface-container-low rounded-lg font-label-md text-label-md uppercase tracking-widest transition-colors"
          >
            Back to Match Feed
          </button>
        </div>
      </div>
    </div>
  );
}
