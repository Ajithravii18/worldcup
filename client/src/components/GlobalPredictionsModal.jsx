import { useEffect, useState } from 'react';
import TeamFlag from './TeamFlag';
import UserAvatar from './UserAvatar';

export default function GlobalPredictionsModal({ isOpen, onClose, match, predictions = [] }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setAnimate(false);
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

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) { setAnimate(false); setTimeout(onClose, 250); } }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-white backdrop-blur-sm transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className={`w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-none rounded-2xl border border-outline-variant/30 p-6 relative transition-all duration-300 glass-panel shadow-xl ${animate ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}
      >


        <button
          onClick={() => { setAnimate(false); setTimeout(onClose, 250); }}
          className="absolute right-6 top-6 w-10 h-10 rounded-full border border-outline-variant/30 bg-white hover:bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-white transition-colors text-sm font-bold z-10"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="text-center mb-8 mt-2">
          <span className="font-label-md text-sm font-bold text-primary uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded border border-primary/30 shadow-neon-primary">
            <span className="material-symbols-outlined text-[16px] mr-2 align-text-bottom">bar_chart</span> MATCH STATISTICS
          </span>
          <div className="text-sm text-on-surface-variant mt-5 font-headline-md tracking-wide uppercase">{match.group} • {match.venue}</div>
          <div className="text-xs text-on-surface-variant font-label-md tracking-widest mt-1">{formattedKickoff}</div>
        </div>

        <div className="flex items-center justify-between bg-white border border-outline-variant/30 rounded-2xl p-5 mb-8 relative overflow-hidden shadow-subtle-card">
          <div className="flex-1 text-center flex flex-col items-center">
            <div className="w-16 h-10 rounded bg-white border border-outline-variant/50 flex items-center justify-center overflow-hidden shadow-md mb-2">
              <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover" />
            </div>
            <div className="font-headline-md text-base text-on-surface font-bold tracking-wide uppercase truncate w-full">{match.homeTeam}</div>
          </div>
          
          <div className="px-4 text-center">
            {match.status === 'completed' ? (
              <div className="font-display-lg text-4xl font-bold text-primary bg-white px-5 py-2 border border-outline-variant/30 rounded-lg shadow-subtle-card drop-shadow-sm">
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div className="font-headline-md text-3xl font-light text-outline-variant/50 italic tracking-wider">VS</div>
            )}
          </div>

          <div className="flex-1 text-center flex flex-col items-center">
            <div className="w-16 h-10 rounded bg-white border border-outline-variant/50 flex items-center justify-center overflow-hidden shadow-md mb-2">
              <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover" />
            </div>
            <div className="font-headline-md text-base text-on-surface font-bold tracking-wide uppercase truncate w-full">{match.awayTeam}</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center font-label-md text-xs text-on-surface-variant uppercase tracking-[0.2em] mb-3">
            <span>Prediction Voting</span>
            <span className="text-primary">{totalPreds} total preds</span>
          </div>

          {totalPreds > 0 ? (
            <div>
              <div className="w-full bg-white h-3 rounded-full overflow-hidden flex border border-outline-variant/30 shadow-subtle-card">
                {homePct > 0 && <div style={{ width: `${animate ? homePct : 0}%` }} className="bg-secondary transition-all duration-1000 ease-out h-full shadow-[0_0_8px_rgba(255,215,0,0.5)]" />}
                {drawPct > 0 && <div style={{ width: `${animate ? drawPct : 0}%` }} className="bg-outline-variant transition-all duration-1000 ease-out h-full" />}
                {awayPct > 0 && <div style={{ width: `${animate ? awayPct : 0}%` }} className="bg-[#ff3d00] transition-all duration-1000 ease-out h-full shadow-[0_0_8px_rgba(255,61,0,0.5)]" />}
              </div>
              <div className="flex justify-between mt-3 text-xs font-label-md px-1 uppercase tracking-widest">
                <div className="flex items-center gap-2 text-secondary"><span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_5px_rgba(255,215,0,0.5)]" /><span>{match.homeTeam}: {homePct}%</span></div>
                <div className="flex items-center gap-2 text-outline-variant"><span className="w-2.5 h-2.5 rounded-full bg-outline-variant" /><span>Draw: {drawPct}%</span></div>
                <div className="flex items-center gap-2 text-[#ff3d00]"><span className="w-2.5 h-2.5 rounded-full bg-[#ff3d00] shadow-[0_0_5px_rgba(255,61,0,0.5)]" /><span>{match.awayTeam}: {awayPct}%</span></div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-white border border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant text-xs font-label-md uppercase tracking-[0.2em]">
              NO PREDICTIONS YET. BE THE FIRST.
            </div>
          )}
        </div>

        <div>
          <div className="font-label-md text-xs text-on-surface-variant uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">list_alt</span> PREDICTION LEADERBOARD ({predictions.length})
          </div>

          <div className="max-h-56 overflow-y-auto space-y-3 pr-2 scrollbar-none">
            {predictions.length > 0 ? (
              predictions.map((pred, idx) => {
                const isHomeWin = pred.homeGoals > pred.awayGoals;
                const isAwayWin = pred.awayGoals > pred.homeGoals;
                
                return (
                  <div key={pred._id} className="flex items-center justify-between glass-panel rounded-lg px-5 py-3 shadow-sm border border-outline-variant/20 hover:border-outline-variant/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="font-display-lg text-lg text-on-surface-variant w-4">{idx + 1}</span>
                      <UserAvatar avatarId={pred.user?.avatar} className="w-10 h-10 flex-shrink-0 border-2 border-outline-variant/30 rounded-full object-cover shadow-sm" />
                      <span className="text-base text-on-surface font-headline-md font-bold truncate max-w-[150px]">{pred.user?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-label-md text-[10px] px-3 py-1 rounded border uppercase tracking-widest hidden sm:block ${
                        isHomeWin ? 'bg-secondary/10 text-secondary border-secondary/30' :
                        isAwayWin ? 'bg-[#ff3d00]/10 text-[#ff3d00] border-[#ff3d00]/30' :
                        'bg-white/5 text-on-surface-variant border-outline-variant/30'
                      }`}>
                        {isHomeWin ? 'Home Win' : isAwayWin ? 'Away Win' : 'Draw'}
                      </span>
                      <span className="font-display-lg text-2xl tracking-widest text-primary bg-white px-4 py-1 rounded border border-outline-variant/30 shadow-subtle-card">
                        {pred.homeGoals} - {pred.awayGoals}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-on-surface-variant text-xs py-6 font-label-md uppercase tracking-widest">
                No active predictions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
