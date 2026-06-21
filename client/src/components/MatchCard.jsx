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
    if (match.status === 'live')       return <span className="badge-live animate-pulse">LIVE</span>;
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
        className="flex flex-col cursor-pointer transition-colors duration-150 min-h-[140px] relative overflow-hidden"
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderLeft: isPerfect ? '3px solid #22c55e' : '3px solid #e2e8f0',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#F26522'}
        onMouseLeave={e => e.currentTarget.style.borderColor = isPerfect ? '#22c55e' : '#e2e8f0'}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>
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
            <span className={`font-display text-[10px] font-bold text-center truncate w-full px-1 ${homeWin ? 'text-slate-900' : 'text-[#6b7280]'}`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 min-w-[64px] justify-center" style={{ background: '#f1f5f9' }}>
            <span className={`font-display text-2xl font-black ${homeWin ? 'text-slate-900' : 'text-slate-400'}`}>{match.homeScore}</span>
            <span className="text-[#cbd5e1] text-sm mx-0.5">–</span>
            <span className={`font-display text-2xl font-black ${awayWin ? 'text-slate-900' : 'text-slate-400'}`}>{match.awayScore}</span>
          </div>

          <div className={`flex-1 flex flex-col items-center gap-1.5 ${!awayWin && !draw ? 'opacity-40' : ''}`}>
            {isTBD(match.awayTeam)
              ? <span className="text-xl opacity-20">?</span>
              : <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-8 h-6" />
            }
            <span className={`font-display text-[10px] font-bold text-center truncate w-full px-1 ${awayWin ? 'text-slate-900' : 'text-[#6b7280]'}`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
        </div>

        {/* Prediction row */}
        {prediction && (
          <div className="px-3 py-2 text-center" style={{ borderTop: '1px solid #e2e8f0' }}>
            {isPerfect ? (
              <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: '#22c55e' }}>
                🏆 Perfect Prediction
              </span>
            ) : (
              <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>
                Predicted: <span style={{ color: '#0f172a' }}>{prediction.homeGoals} – {prediction.awayGoals}</span>
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
      className="flex flex-col cursor-pointer transition-colors duration-150 min-h-[140px] relative"
      style={{
        background: isLocked || isEarly ? '#f1f5f9' : '#ffffff',
        border: '1px solid',
        borderColor: isOpen && !prediction ? '#F26522' : '#e2e8f0',
        borderLeft: isOpen && !prediction ? '3px solid #F26522' : '3px solid #e2e8f0',
        opacity: isLocked ? 0.75 : 1,
      }}
      onMouseEnter={e => { if (!isLocked) e.currentTarget.style.background = '#f8fafc'; }}
      onMouseLeave={e => e.currentTarget.style.background = isLocked || isEarly ? '#f1f5f9' : '#ffffff'}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>
          {formattedTime}
        </span>
        <StatusBadge />
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-2.5 px-3 py-3 flex-1">
        {/* Home */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isTBD(match.homeTeam)
              ? <span className="text-lg opacity-30">?</span>
              : <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} />
            }
            <span className={`font-display text-sm font-bold truncate max-w-[90px] sm:max-w-[120px] ${isTBD(match.homeTeam) ? 'italic text-[10px]' : 'text-[#0f172a]'}`}
              style={{ color: isTBD(match.homeTeam) ? '#64748b' : undefined }}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>
          {prediction && (
            <span className="font-display text-sm font-black" style={{ color: '#F26522' }}>
              {prediction.homeGoals}
            </span>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isTBD(match.awayTeam)
              ? <span className="text-lg opacity-30">?</span>
              : <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} />
            }
            <span className={`font-display text-sm font-bold truncate max-w-[90px] sm:max-w-[120px]`}
              style={{ color: isTBD(match.awayTeam) ? '#64748b' : '#0f172a' }}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
          {prediction && (
            <span className="font-display text-sm font-black" style={{ color: '#F26522' }}>
              {prediction.awayGoals}
            </span>
          )}
        </div>
      </div>

      {/* Predicted footer */}
      {prediction && (
        <div className="px-3 py-1.5 text-center" style={{ borderTop: '1px solid #e2e8f0' }}>
          <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: '#F26522' }}>
            ✓ Predicted
          </span>
        </div>
      )}
    </article>
  );
}
