import { useState } from 'react';
import TeamFlag from './TeamFlag';

export default function MatchCard({
  match,
  prediction = null,
  onClick,
}) {
  const timeState = match.timeState; // 'early' | 'open' | 'locked'
  const isLocked = timeState === 'locked';
  const isEarly = timeState === 'early';
  const isOpen = timeState === 'open';

  // Format kickoff time
  const kickoffDate = new Date(match.kickoffTime);
  const formattedTime = kickoffDate.toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const statusBadge = () => {
    if (match.status === 'live') return <span className="bg-red-50 text-red-600 border-red-200 border px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest animate-pulse">LIVE</span>;
    if (match.status === 'completed') return <span className="bg-gray-100 text-gray-500 border-gray-200 border px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">FT</span>;
    if (isEarly) return <span className="bg-gray-100 text-gray-500 border-gray-200 border px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">SOON</span>;
    if (isOpen) return <span className="bg-theme-soft/20 text-theme-secondary border-theme-highlight border px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">OPEN</span>;
    if (isLocked) return <span className="bg-gray-100 text-gray-500 border-gray-200 border px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">LOCKED</span>;
    return null;
  };

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
    // Already readable — show as-is, but shorten if too long
    if (isTBD(name)) return name.length > 16 ? name.substring(0, 15) + '…' : name;
    // Normal country name truncation
    const parts = name.split(' ');
    if (parts.length > 1 && name.length > 10) return parts[0].substring(0, 3).toUpperCase() + '...';
    if (name.length > 8) return name.substring(0, 3).toUpperCase();
    return name;
  };

  if (match.status === 'completed') {
    const homeWin = match.homeScore > match.awayScore;
    const awayWin = match.awayScore > match.homeScore;
    const draw = match.homeScore === match.awayScore;

    return (
      <article
        onClick={() => onClick && onClick(match)}
        className="bg-white border-2 border-gray-300 rounded-xl p-4 flex flex-col justify-between items-center cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg hover:border-theme-primary hover:border-l-theme-primary min-h-[140px] relative overflow-hidden border-l-[6px] border-l-gray-400"
      >
        <div className="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-3 border-b-2 border-gray-200 pb-1 w-full text-center">
          {formattedTime} • FINAL
        </div>

        <div className="flex items-center justify-between w-full gap-2 my-auto">
          {/* Home Team */}
          <div className={`flex-1 flex flex-col items-center gap-1.5 ${!homeWin && !draw ? 'opacity-40 grayscale hover:grayscale-0 transition-all' : ''}`}>
            {isTBD(match.homeTeam)
              ? <span className="text-xl opacity-20">?</span>
              : <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-8 h-6 border border-gray-200" />
            }
            <span className={`font-display text-[10px] sm:text-xs font-bold text-center truncate w-full px-1 ${homeWin ? 'text-theme-secondary font-black' : 'text-gray-800'}`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 shadow-inner min-w-[70px] justify-center">
            <span className={`font-display text-xl sm:text-2xl font-black ${homeWin ? 'text-theme-secondary' : 'text-gray-900'}`}>{match.homeScore}</span>
            <span className="text-gray-300 text-sm">-</span>
            <span className={`font-display text-xl sm:text-2xl font-black ${awayWin ? 'text-theme-secondary' : 'text-gray-900'}`}>{match.awayScore}</span>
          </div>

          {/* Away Team */}
          <div className={`flex-1 flex flex-col items-center gap-1.5 ${!awayWin && !draw ? 'opacity-40 grayscale hover:grayscale-0 transition-all' : ''}`}>
            {isTBD(match.awayTeam)
              ? <span className="text-xl opacity-20">?</span>
              : <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-8 h-6 border border-gray-200" />
            }
            <span className={`font-display text-[10px] sm:text-xs font-bold text-center truncate w-full px-1 ${awayWin ? 'text-theme-secondary font-black' : 'text-gray-800'}`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
        </div>

        {/* Prediction Feedback */}
        {prediction && (
          <div className="mt-3 w-full border-t border-gray-100 pt-2 text-center flex flex-col items-center justify-center">
            {prediction.homeGoals === match.homeScore && prediction.awayGoals === match.awayScore ? (
              <span className="text-[8px] text-green-700 font-black uppercase tracking-widest bg-green-100 px-2 py-0.5 border border-green-200 shadow-sm rounded-full">
                🏆 PERFECT PREDICTION
              </span>
            ) : (
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">
                PREDICTED: <span className="text-gray-600 font-black">{prediction.homeGoals} - {prediction.awayGoals}</span>
              </span>
            )}
          </div>
        )}
      </article>
    );
  }

  return (
    <article
      onClick={() => onClick && onClick(match)}
      className={`bg-white border-2 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg min-h-[140px] border-l-[6px] ${
        isOpen && !prediction ? 'border-theme-primary border-l-theme-primary shadow-[0_4px_12px_rgba(37,99,235,0.15)]' : 'border-gray-300 border-l-gray-400'
      } ${
        isLocked || isEarly ? 'opacity-90 bg-gray-50' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{formattedTime}</span>
        {statusBadge()}
      </div>

      <div className="flex flex-col gap-2 my-auto">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isTBD(match.homeTeam)
              ? <span className="text-lg opacity-40">?</span>
              : <TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} />
            }
            <span className={`font-display text-sm font-bold truncate max-w-[90px] sm:max-w-[120px] lg:max-w-none ${
              isTBD(match.homeTeam) ? 'text-gray-400 italic text-[10px]' : 'text-gray-900'
            }`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>
          {prediction && (
            <span className={`font-display text-sm font-black text-theme-secondary font-medium`}>
              {prediction?.homeGoals}
            </span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isTBD(match.awayTeam)
              ? <span className="text-lg opacity-40">?</span>
              : <TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} />
            }
            <span className={`font-display text-sm font-bold truncate max-w-[90px] sm:max-w-[120px] lg:max-w-none ${
              isTBD(match.awayTeam) ? 'text-gray-400 italic text-[10px]' : 'text-gray-900'
            }`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
          {prediction && (
            <span className={`font-display text-sm font-black text-theme-secondary font-medium`}>
              {prediction?.awayGoals}
            </span>
          )}
        </div>
      </div>

      {prediction && (
        <div className="mt-3 text-center border-t border-gray-100 pt-2">
          <span className="text-[8px] text-theme-primary font-black uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-full">
            ✓ PREDICTED
          </span>
        </div>
      )}
    </article>
  );
}
