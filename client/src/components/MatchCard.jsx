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
        <div className="inline-flex items-center px-2 py-0.5 rounded border border-primary/50 bg-primary/10 text-primary font-label-md text-xs sm:text-sm uppercase tracking-wide shadow-neon-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse"></span>
          {liveText}
        </div>
      );
    }
    if (match.status === 'completed')  return <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-label-sm text-[10px] sm:text-xs uppercase tracking-wide border border-outline-variant/30">FT</span>;
    if (isEarly)  return <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-label-sm text-[10px] sm:text-xs uppercase tracking-wide border border-outline-variant/50">Soon</span>;
    if (isOpen)   return <span className="inline-flex items-center px-2 sm:px-3 py-0.5 rounded bg-primary/10 text-primary font-label-md text-xs sm:text-sm uppercase tracking-wide border border-primary/50">Open</span>;
    if (isLocked) return <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-label-sm text-[10px] sm:text-xs uppercase tracking-wide border border-outline-variant/50">Locked</span>;
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
        className={`stadium-card flex flex-col cursor-pointer transition-all duration-200 min-h-[140px] hover:-translate-y-1 ${isPerfect ? 'border-primary/60 shadow-neon-primary' : 'hover:border-outline-variant'}`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-outline-variant/30 bg-transparent">
          <span className="font-label-sm text-[10px] uppercase tracking-wide text-on-surface-variant">
            {formattedTime}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-variant text-on-surface font-label-sm text-[10px] uppercase tracking-wide border border-outline-variant/50">FT</span>
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between gap-1 px-2 py-3 flex-1 relative z-10 bg-transparent">
          <div className={`flex-1 flex flex-col items-center gap-1.5 ${!homeWin && !draw ? 'opacity-50 grayscale-[30%]' : ''}`}>
            {isTBD(match.homeTeam)
              ? <span className="text-lg opacity-30 text-on-surface">?</span>
              : <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-8 h-6 sm:w-10 sm:h-7 rounded shadow-sm" />
            }
            <span className={`font-headline-md text-sm sm:text-base text-center truncate w-full px-1 ${homeWin ? 'text-on-surface drop-shadow-sm' : 'text-on-surface-variant'}`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>

          <div className="flex items-center justify-center bg-surface-variant rounded-xl border border-outline-variant/30 px-2 sm:px-3 py-1.5 shrink-0 shadow-subtle-card min-w-[50px] sm:min-w-[70px]">
            <span className={`font-display-lg text-2xl sm:text-3xl tracking-tighter ${homeWin ? 'text-primary' : draw ? 'text-on-surface' : 'text-on-surface-variant'}`}>{match.homeScore}</span>
            <span className="text-on-surface-variant text-xs mx-1 font-bold">-</span>
            <span className={`font-display-lg text-2xl sm:text-3xl tracking-tighter ${awayWin ? 'text-primary' : draw ? 'text-on-surface' : 'text-on-surface-variant'}`}>{match.awayScore}</span>
          </div>

          <div className={`flex-1 flex flex-col items-center gap-1.5 ${!awayWin && !draw ? 'opacity-50 grayscale-[30%]' : ''}`}>
            {isTBD(match.awayTeam)
              ? <span className="text-lg opacity-30 text-on-surface">?</span>
              : <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-8 h-6 sm:w-10 sm:h-7 rounded shadow-sm" />
            }
            <span className={`font-headline-md text-sm sm:text-base text-center truncate w-full px-1 ${awayWin ? 'text-on-surface drop-shadow-sm' : 'text-on-surface-variant'}`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
        </div>

        {/* Prediction row */}
        {prediction && (
          <div className={`px-2 py-2 text-center border-t border-outline-variant/30 ${isPerfect ? 'bg-primary/10' : 'bg-transparent'}`}>
            {isPerfect ? (
              <span className="font-label-md text-[10px] sm:text-xs uppercase tracking-wide text-primary flex items-center justify-center gap-1 drop-shadow-sm">
                <span className="material-symbols-outlined text-[14px]">stars</span> Perfect
              </span>
            ) : (
              <span className="font-label-sm text-[10px] sm:text-xs uppercase tracking-wide text-on-surface-variant">
                Pred: <span className="text-on-surface font-bold ml-1">{prediction.homeGoals} - {prediction.awayGoals}</span>
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
      className="stadium-card flex flex-col cursor-pointer transition-all duration-200 min-h-[140px] hover:-translate-y-1 hover:border-primary/50 hover:shadow-md group"
      style={{
        borderColor: isOpen && !prediction ? 'rgba(242,101,34,0.4)' : undefined,
        opacity: isLocked ? 0.6 : 1,
      }}
    >
      {/* Active Top Border Glow */}
      {isOpen && !prediction && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />}

      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-outline-variant/30 bg-transparent">
        <span className="font-label-sm text-[10px] uppercase tracking-wide text-on-surface-variant group-hover:text-on-surface transition-colors">
          {formattedTime}
        </span>
        <StatusBadge />
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 flex-1 relative z-10 bg-transparent">
        {/* Home */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            {isTBD(match.homeTeam)
              ? <span className="text-lg opacity-30 text-on-surface font-display-lg shrink-0">?</span>
              : <div className="w-8 h-6 sm:w-10 sm:h-7 rounded shadow-sm overflow-hidden shrink-0"><TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover" /></div>
            }
            <span className={`font-headline-md text-base sm:text-lg truncate tracking-wide ${isTBD(match.homeTeam) ? 'italic text-sm text-on-surface-variant font-body-md' : 'text-on-surface'}`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>
          {prediction && (
            <div className="bg-surface-variant border border-outline-variant/50 w-7 h-9 sm:w-8 sm:h-10 rounded flex items-center justify-center shrink-0 ml-2">
              <span className="font-display-lg text-xl sm:text-2xl text-primary tracking-tighter drop-shadow-sm">
                {prediction.homeGoals}
              </span>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            {isTBD(match.awayTeam)
              ? <span className="text-lg opacity-30 text-on-surface font-display-lg shrink-0">?</span>
              : <div className="w-8 h-6 sm:w-10 sm:h-7 rounded shadow-sm overflow-hidden shrink-0"><TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover" /></div>
            }
            <span className={`font-headline-md text-base sm:text-lg truncate tracking-wide ${isTBD(match.awayTeam) ? 'italic text-sm text-on-surface-variant font-body-md' : 'text-on-surface'}`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
          {prediction && (
            <div className="bg-surface-variant border border-outline-variant/50 w-7 h-9 sm:w-8 sm:h-10 rounded flex items-center justify-center shrink-0 ml-2">
              <span className="font-display-lg text-xl sm:text-2xl text-primary tracking-tighter drop-shadow-sm">
                {prediction.awayGoals}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Predicted footer */}
      {prediction && (
        <div className="px-3 py-2 text-center bg-transparent border-t border-outline-variant/30">
          <span className="font-label-md text-[10px] sm:text-xs uppercase tracking-wide text-primary flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[12px] sm:text-[14px]">check_circle</span> Locked In
          </span>
        </div>
      )}
    </article>
  );
}
