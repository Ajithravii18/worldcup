import { useState } from 'react';
import TeamFlag from './TeamFlag';

export default function MatchCard({ match, prediction = null, onClick }) {
  const timeState = match.timeState;
  const isLocked = timeState === 'locked';
  const isEarly  = timeState === 'early';
  const isOpen   = timeState === 'open';

  const kickoffDate  = new Date(match.kickoffTime);
  const formattedTime = kickoffDate.toLocaleString('en-IN', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const isTBD = (name) => {
    if (!name) return true;
    if (/^(TBD|Winner|Runner-up|Loser|#\d+)/i.test(name)) return true;
    if (/^\d/.test(name)) return true;
    if (name.includes('/')) return true;
    if (/^[A-Z0-9]{1,5}$/.test(name)) return true;
    return false;
  };

  const displayTeam = (name) => {
    if (!name) return 'TBD';
    if (isTBD(name)) return name.length > 16 ? name.substring(0, 15) + '…' : name;
    const parts = name.split(' ');
    if (parts.length > 1 && name.length > 10) return parts[0].substring(0, 3).toUpperCase();
    if (name.length > 8) return name.substring(0, 3).toUpperCase();
    return name;
  };

  const StatusBadge = () => {
    if (match.status === 'live') {
      let liveText = 'LIVE';
      if (match.shortStatus && match.shortStatus !== '1H' && match.shortStatus !== '2H') {
        liveText = match.shortStatus;
      } else if (match.elapsed) {
        liveText = `${match.elapsed}'`;
      }
      return (
        <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#1e4620] font-label-sm text-[10px] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5 animate-pulse"></span>
          {liveText}
        </div>
      );
    }
    if (match.status === 'completed')  return <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] uppercase tracking-wider">FT</span>;
    if (isEarly)  return <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[10px] uppercase tracking-wider">Soon</span>;
    if (isOpen)   return <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] uppercase tracking-wider border border-primary-fixed-dim">Open</span>;
    if (isLocked) return <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[10px] uppercase tracking-wider">Locked</span>;
    return null;
  };

  // ── COMPLETED CARD ──────────────────────────────────────────────────────────
  if (match.status === 'completed') {
    const homeWin = match.homeScore > match.awayScore;
    const awayWin = match.awayScore > match.homeScore;
    const draw    = match.homeScore === match.awayScore;

    const isPerfect = prediction &&
      prediction.homeGoals === match.homeScore &&
      prediction.awayGoals === match.awayScore;

    return (
      <article
        onClick={() => onClick && onClick(match)}
        className="stadium-card flex flex-col cursor-pointer transition-all duration-150 min-h-[140px] hover:border-primary hover:shadow-md"
        style={{
          borderLeft: isPerfect ? '3px solid #1b6d24' : undefined,
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-surface-container-high">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
            {formattedTime}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] uppercase tracking-wider">FT</span>
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between gap-2 px-4 py-4 flex-1">
          <div className={`flex-1 flex flex-col items-center gap-1.5 ${!homeWin && !draw ? 'opacity-50' : ''}`}>
            {isTBD(match.homeTeam)
              ? <span className="text-xl opacity-30 text-on-surface">?</span>
              : <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-10 h-8" />
            }
            <span className={`font-headline-md text-sm text-center truncate w-full px-1 ${homeWin ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 min-w-[64px] justify-center bg-surface-container-low rounded-lg border border-outline-variant">
            <span className={`font-display-lg text-xl tracking-tighter ${homeWin ? 'text-on-surface' : 'text-on-surface-variant'}`}>{match.homeScore}</span>
            <span className="text-on-surface-variant text-sm mx-1">–</span>
            <span className={`font-display-lg text-xl tracking-tighter ${awayWin ? 'text-on-surface' : 'text-on-surface-variant'}`}>{match.awayScore}</span>
          </div>

          <div className={`flex-1 flex flex-col items-center gap-1.5 ${!awayWin && !draw ? 'opacity-50' : ''}`}>
            {isTBD(match.awayTeam)
              ? <span className="text-xl opacity-30 text-on-surface">?</span>
              : <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-10 h-8" />
            }
            <span className={`font-headline-md text-sm text-center truncate w-full px-1 ${awayWin ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
        </div>

        {/* Prediction row */}
        {prediction && (
          <div className="px-4 py-2 text-center bg-surface-container-lowest border-t border-surface-container-high">
            {isPerfect ? (
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span> Perfect Prediction
              </span>
            ) : (
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                Predicted: <span className="text-on-surface">{prediction.homeGoals} – {prediction.awayGoals}</span>
              </span>
            )}
          </div>
        )}
      </article>
    );
  }

  // ── UPCOMING / LIVE CARD ────────────────────────────────────────────────────
  return (
    <article
      onClick={() => onClick && onClick(match)}
      className="stadium-card flex flex-col cursor-pointer transition-all duration-150 min-h-[140px] hover:border-primary hover:shadow-md"
      style={{
        borderColor: isOpen && !prediction ? '#001278' : undefined,
        borderLeft: isOpen && !prediction ? '3px solid #001278' : undefined,
        opacity: isLocked ? 0.7 : 1,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-surface-container-high bg-surface-container-lowest">
        <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
          {formattedTime}
        </span>
        <StatusBadge />
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-3 px-4 py-4 flex-1">
        {/* Home */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isTBD(match.homeTeam)
              ? <span className="text-lg opacity-30 text-on-surface">?</span>
              : <div className="w-8 h-6 rounded border border-outline-variant bg-surface overflow-hidden"><TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover" /></div>
            }
            <span className={`font-headline-md text-base truncate max-w-[120px] sm:max-w-[150px] ${isTBD(match.homeTeam) ? 'italic text-sm text-on-surface-variant font-body-md' : 'text-on-surface'}`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>
          {prediction && (
            <span className="font-display-lg text-xl text-primary tracking-tighter">
              {prediction.homeGoals}
            </span>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isTBD(match.awayTeam)
              ? <span className="text-lg opacity-30 text-on-surface">?</span>
              : <div className="w-8 h-6 rounded border border-outline-variant bg-surface overflow-hidden"><TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover" /></div>
            }
            <span className={`font-headline-md text-base truncate max-w-[120px] sm:max-w-[150px] ${isTBD(match.awayTeam) ? 'italic text-sm text-on-surface-variant font-body-md' : 'text-on-surface'}`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
          {prediction && (
            <span className="font-display-lg text-xl text-primary tracking-tighter">
              {prediction.awayGoals}
            </span>
          )}
        </div>
      </div>

      {/* Predicted footer */}
      {prediction && (
        <div className="px-4 py-2 text-center bg-surface-container-low border-t border-surface-container-high">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Predicted
          </span>
        </div>
      )}
    </article>
  );
}
