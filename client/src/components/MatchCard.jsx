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
        <div className="inline-flex items-center px-3 py-0.5 rounded border border-[#00ff87]/50 bg-black/60 text-[#00ff87] font-label-md text-sm uppercase tracking-widest shadow-neon-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] mr-1.5 animate-pulse"></span>
          {liveText}
        </div>
      );
    }
    if (match.status === 'completed')  return <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/10 text-on-surface font-label-sm text-xs uppercase tracking-widest border border-white/20">FT</span>;
    if (isEarly)  return <span className="inline-flex items-center px-2 py-0.5 rounded bg-black/40 text-on-surface-variant font-label-sm text-xs uppercase tracking-widest border border-outline-variant/50">Soon</span>;
    if (isOpen)   return <span className="inline-flex items-center px-3 py-0.5 rounded bg-primary/10 text-primary font-label-md text-sm uppercase tracking-widest border border-primary/50 shadow-[inset_0_0_8px_rgba(0,255,135,0.2)]">Open</span>;
    if (isLocked) return <span className="inline-flex items-center px-2 py-0.5 rounded bg-black/40 text-on-surface-variant font-label-sm text-xs uppercase tracking-widest border border-outline-variant/50">Locked</span>;
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
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-outline-variant/30 bg-black/20">
          <span className="font-label-sm text-[11px] uppercase tracking-widest text-on-surface-variant">
            {formattedTime}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/10 text-on-surface font-label-sm text-xs uppercase tracking-widest border border-white/20">FT</span>
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between gap-2 px-4 py-4 flex-1 relative z-10 bg-black/10">
          <div className={`flex-1 flex flex-col items-center gap-2 ${!homeWin && !draw ? 'opacity-40 grayscale-[50%]' : ''}`}>
            {isTBD(match.homeTeam)
              ? <span className="text-xl opacity-30 text-on-surface">?</span>
              : <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-12 h-8 rounded shadow-sm" />
            }
            <span className={`font-headline-md text-lg text-center truncate w-full px-1 ${homeWin ? 'text-on-surface drop-shadow-md' : 'text-on-surface-variant'}`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>

          <div className="flex items-center justify-center bg-black/60 rounded-xl border border-outline-variant/50 px-3 py-2 shrink-0 shadow-inner min-w-[70px]">
            <span className={`font-display-lg text-3xl tracking-tighter ${homeWin ? 'text-primary' : draw ? 'text-on-surface' : 'text-on-surface-variant'}`}>{match.homeScore}</span>
            <span className="text-on-surface-variant text-sm mx-1.5 font-bold">-</span>
            <span className={`font-display-lg text-3xl tracking-tighter ${awayWin ? 'text-primary' : draw ? 'text-on-surface' : 'text-on-surface-variant'}`}>{match.awayScore}</span>
          </div>

          <div className={`flex-1 flex flex-col items-center gap-2 ${!awayWin && !draw ? 'opacity-40 grayscale-[50%]' : ''}`}>
            {isTBD(match.awayTeam)
              ? <span className="text-xl opacity-30 text-on-surface">?</span>
              : <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-12 h-8 rounded shadow-sm" />
            }
            <span className={`font-headline-md text-lg text-center truncate w-full px-1 ${awayWin ? 'text-on-surface drop-shadow-md' : 'text-on-surface-variant'}`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
        </div>

        {/* Prediction row */}
        {prediction && (
          <div className={`px-4 py-2.5 text-center border-t border-outline-variant/30 ${isPerfect ? 'bg-primary/10' : 'bg-black/40'}`}>
            {isPerfect ? (
              <span className="font-label-md text-sm uppercase tracking-widest text-primary flex items-center justify-center gap-1.5 drop-shadow-[0_0_5px_rgba(0,255,135,0.5)]">
                <span className="material-symbols-outlined text-[16px]">stars</span> Perfect Prediction
              </span>
            ) : (
              <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
                Predicted: <span className="text-on-surface font-bold ml-1">{prediction.homeGoals} - {prediction.awayGoals}</span>
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
      className="stadium-card flex flex-col cursor-pointer transition-all duration-200 min-h-[140px] hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(0,255,135,0.15)] group"
      style={{
        borderColor: isOpen && !prediction ? 'rgba(0,255,135,0.4)' : undefined,
        opacity: isLocked ? 0.6 : 1,
      }}
    >
      {/* Active Top Border Glow */}
      {isOpen && !prediction && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />}

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-outline-variant/30 bg-black/20">
        <span className="font-label-sm text-[11px] uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface transition-colors">
          {formattedTime}
        </span>
        <StatusBadge />
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-4 px-5 py-5 flex-1 relative z-10">
        {/* Home */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isTBD(match.homeTeam)
              ? <span className="text-xl opacity-30 text-on-surface font-display-lg">?</span>
              : <div className="w-10 h-7 rounded shadow-sm overflow-hidden"><TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover" /></div>
            }
            <span className={`font-headline-md text-xl truncate max-w-[120px] sm:max-w-[150px] tracking-wide ${isTBD(match.homeTeam) ? 'italic text-base text-on-surface-variant font-body-md' : 'text-on-surface'}`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>
          {prediction && (
            <div className="bg-black/50 border border-outline-variant/50 w-8 h-10 rounded flex items-center justify-center">
              <span className="font-display-lg text-2xl text-primary tracking-tighter drop-shadow-[0_0_5px_rgba(0,255,135,0.4)]">
                {prediction.homeGoals}
              </span>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isTBD(match.awayTeam)
              ? <span className="text-xl opacity-30 text-on-surface font-display-lg">?</span>
              : <div className="w-10 h-7 rounded shadow-sm overflow-hidden"><TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover" /></div>
            }
            <span className={`font-headline-md text-xl truncate max-w-[120px] sm:max-w-[150px] tracking-wide ${isTBD(match.awayTeam) ? 'italic text-base text-on-surface-variant font-body-md' : 'text-on-surface'}`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
          {prediction && (
            <div className="bg-black/50 border border-outline-variant/50 w-8 h-10 rounded flex items-center justify-center">
              <span className="font-display-lg text-2xl text-primary tracking-tighter drop-shadow-[0_0_5px_rgba(0,255,135,0.4)]">
                {prediction.awayGoals}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Predicted footer */}
      {prediction && (
        <div className="px-4 py-2.5 text-center bg-black/40 border-t border-outline-variant/30">
          <span className="font-label-md text-xs uppercase tracking-widest text-primary/80 flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">check_circle</span> Locked In
          </span>
        </div>
      )}
    </article>
  );
}
