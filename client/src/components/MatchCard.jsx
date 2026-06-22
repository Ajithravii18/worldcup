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
      return <span className="badge-live animate-pulse">{liveText}</span>;
    }
    if (match.status === 'completed')  return <span className="badge-completed">FT</span>;
    if (isEarly)  return <span className="badge-soon">Soon</span>;
    if (isOpen)   return <span className="badge-open">Open</span>;
    if (isLocked) return <span className="badge-locked">Locked</span>;
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
        className="flex flex-col cursor-pointer transition-colors duration-150 min-h-[140px] relative overflow-hidden glass-card"
        style={{
          borderLeft: isPerfect ? '3px solid #4be277' : undefined,
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5 fm-divider">
          <span className="text-[10px] font-mono uppercase tracking-widest text-fm-muted">
            {formattedTime}
          </span>
          <span className="badge-completed">FT</span>
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between gap-2 px-3 py-3 flex-1">
          <div className={`flex-1 flex flex-col items-center gap-1.5 ${!homeWin && !draw ? 'opacity-40' : ''}`}>
            {isTBD(match.homeTeam)
              ? <span className="text-xl opacity-20">?</span>
              : <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-8 h-6" />
            }
            <span className={`font-display text-[12px] font-bold text-center truncate w-full px-1 ${homeWin ? 'text-white' : 'text-fm-muted'}`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 min-w-[64px] justify-center bg-black/20 rounded">
            <span className={`font-mono text-xl font-bold ${homeWin ? 'text-white' : 'text-fm-muted'}`}>{match.homeScore}</span>
            <span className="text-fm-muted text-sm mx-0.5">–</span>
            <span className={`font-mono text-xl font-bold ${awayWin ? 'text-white' : 'text-fm-muted'}`}>{match.awayScore}</span>
          </div>

          <div className={`flex-1 flex flex-col items-center gap-1.5 ${!awayWin && !draw ? 'opacity-40' : ''}`}>
            {isTBD(match.awayTeam)
              ? <span className="text-xl opacity-20">?</span>
              : <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-8 h-6" />
            }
            <span className={`font-display text-[12px] font-bold text-center truncate w-full px-1 ${awayWin ? 'text-white' : 'text-fm-muted'}`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
        </div>

        {/* Prediction row */}
        {prediction && (
          <div className="px-3 py-2 text-center fm-divider">
            {isPerfect ? (
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-fm-green drop-shadow-[0_0_4px_rgba(75,226,119,0.5)]">
                🏆 Perfect Prediction
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-fm-muted">
                Predicted: <span className="text-white">{prediction.homeGoals} – {prediction.awayGoals}</span>
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
      className="flex flex-col cursor-pointer transition-colors duration-150 min-h-[140px] relative glass-card"
      style={{
        borderColor: isOpen && !prediction ? '#ec6a06' : undefined,
        borderLeft: isOpen && !prediction ? '3px solid #ec6a06' : undefined,
        opacity: isLocked ? 0.6 : 1,
      }}
      onMouseEnter={e => { if (!isLocked) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5 fm-divider">
        <span className="text-[10px] font-mono uppercase tracking-widest text-fm-muted">
          {formattedTime}
        </span>
        <StatusBadge />
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-2.5 px-3 py-3 flex-1">
        {/* Home */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isTBD(match.homeTeam)
              ? <span className="text-lg opacity-30 text-white">?</span>
              : <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} />
            }
            <span className={`font-display text-base font-bold truncate max-w-[120px] sm:max-w-[150px] ${isTBD(match.homeTeam) ? 'italic text-sm text-fm-muted' : 'text-white'}`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>
          {prediction && (
            <span className="font-mono text-lg font-bold text-fm-green">
              {prediction.homeGoals}
            </span>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isTBD(match.awayTeam)
              ? <span className="text-lg opacity-30 text-white">?</span>
              : <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} />
            }
            <span className={`font-display text-base font-bold truncate max-w-[120px] sm:max-w-[150px] ${isTBD(match.awayTeam) ? 'italic text-sm text-fm-muted' : 'text-white'}`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
          {prediction && (
            <span className="font-mono text-lg font-bold text-fm-green">
              {prediction.awayGoals}
            </span>
          )}
        </div>
      </div>

      {/* Predicted footer */}
      {prediction && (
        <div className="px-3 py-1.5 text-center fm-divider">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-fm-green">
            ✓ Predicted
          </span>
        </div>
      )}
    </article>
  );
}
