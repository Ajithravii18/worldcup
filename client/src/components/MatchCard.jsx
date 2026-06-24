import { motion } from 'framer-motion';
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
    if (/^[A-Z0-9]{1,5}$/.test(name) && name !== 'USA') return true;
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
        <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded bg-primary/20 text-primary font-display text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black shadow-neon-primary border border-primary/50">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse"></span>
          {liveText}
        </div>
      );
    }
    if (match.status === 'completed') return <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/10 text-white font-display text-[10px] sm:text-xs uppercase tracking-widest border border-white/20 font-bold">FT</span>;
    if (isEarly)  return <span className="inline-flex items-center px-2 py-0.5 rounded bg-black/40 text-outline-variant font-display text-[10px] sm:text-xs uppercase tracking-widest border border-white/10 font-bold">Soon</span>;
    if (isOpen)   return <span className="inline-flex items-center px-2 sm:px-3 py-0.5 rounded bg-primary/10 text-primary font-display text-[10px] sm:text-xs uppercase tracking-widest border border-primary/30 font-black shadow-inner">Open</span>;
    if (isLocked) return <span className="inline-flex items-center px-2 py-0.5 rounded bg-error/20 text-error-container font-display text-[10px] sm:text-xs uppercase tracking-widest border border-error/30 font-bold shadow-inner">Locked</span>;
    return null;
  };

  const cardVariants = {
    hover: { 
      y: -5,
      scale: 1.02,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    tap: { scale: 0.98 }
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
      <motion.article
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => onClick && onClick(match)}
        className={`relative flex flex-col cursor-pointer min-h-[140px] rounded-2xl overflow-hidden backdrop-blur-xl ${isPerfect ? 'bg-primary/5 border border-primary/50 shadow-neon-primary' : 'bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 shadow-xl'}`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/10 bg-black/20">
          <span className="font-display text-[10px] uppercase tracking-widest text-outline-variant font-bold">
            {formattedTime}
          </span>
          <StatusBadge />
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between gap-1 px-3 py-4 flex-1 relative z-10">
          <div className={`flex-1 flex flex-col items-center gap-2 ${!homeWin && !draw ? 'opacity-40 grayscale' : ''}`}>
            {isTBD(match.homeTeam)
              ? <span className="text-xl opacity-30 text-white font-display font-black">?</span>
              : <div className="w-10 h-7 sm:w-12 sm:h-8 bg-black rounded shadow-md overflow-hidden border border-white/20 -skew-x-6"><TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover skew-x-6" /></div>
            }
            <span className={`font-display text-xs sm:text-sm text-center truncate w-full px-1 uppercase tracking-widest font-black ${homeWin ? 'text-white drop-shadow-md' : 'text-outline-variant'}`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>

          <div className="flex items-center justify-center bg-black/50 rounded-xl border border-white/10 px-3 py-2 shrink-0 shadow-inner backdrop-blur-md min-w-[70px]">
            <span className={`font-display text-2xl sm:text-3xl font-black ${homeWin ? 'text-primary' : draw ? 'text-white' : 'text-outline-variant'}`}>{match.homeScore}</span>
            <span className="text-white/30 text-sm mx-1.5 font-light">-</span>
            <span className={`font-display text-2xl sm:text-3xl font-black ${awayWin ? 'text-primary' : draw ? 'text-white' : 'text-outline-variant'}`}>{match.awayScore}</span>
          </div>

          <div className={`flex-1 flex flex-col items-center gap-2 ${!awayWin && !draw ? 'opacity-40 grayscale' : ''}`}>
            {isTBD(match.awayTeam)
              ? <span className="text-xl opacity-30 text-white font-display font-black">?</span>
              : <div className="w-10 h-7 sm:w-12 sm:h-8 bg-black rounded shadow-md overflow-hidden border border-white/20 -skew-x-6"><TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover skew-x-6" /></div>
            }
            <span className={`font-display text-xs sm:text-sm text-center truncate w-full px-1 uppercase tracking-widest font-black ${awayWin ? 'text-white drop-shadow-md' : 'text-outline-variant'}`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
        </div>

        {/* Prediction row */}
        {prediction && (
          <div className={`px-3 py-2.5 text-center border-t border-white/10 ${isPerfect ? 'bg-primary/20 backdrop-blur-md' : 'bg-black/30'}`}>
            {isPerfect ? (
              <span className="font-display text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center justify-center gap-1.5 drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]">
                <span className="material-symbols-outlined text-[14px]">stars</span> Perfect Prediction
              </span>
            ) : (
              <span className="font-display text-[10px] sm:text-xs font-bold uppercase tracking-widest text-outline-variant">
                Pred: <span className="text-white ml-1 font-black">{prediction.homeGoals} - {prediction.awayGoals}</span>
              </span>
            )}
          </div>
        )}
      </motion.article>
    );
  }

  // ── UPCOMING / LIVE CARD ────────────────────────────────────────────────────
  return (
    <motion.article
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={() => onClick && onClick(match)}
      className="relative flex flex-col cursor-pointer min-h-[140px] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 hover:border-primary/50 shadow-xl group"
      style={{
        opacity: isLocked ? 0.5 : 1,
      }}
    >
      {/* Active Top Border Glow */}
      {isOpen && !prediction && <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 shadow-neon-primary" />}

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/10 bg-black/20">
        <span className="font-display text-[10px] uppercase tracking-widest text-outline-variant font-bold group-hover:text-white transition-colors">
          {formattedTime}
        </span>
        <StatusBadge />
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-3 px-4 py-4 flex-1 relative z-10">
        {/* Home */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {isTBD(match.homeTeam)
              ? <span className="text-xl opacity-30 text-white font-display font-black w-10 text-center">?</span>
              : <div className="w-10 h-7 sm:w-12 sm:h-8 rounded shadow-md overflow-hidden shrink-0 border border-white/20 bg-black -skew-x-6"><TeamFlag teamName={match.homeTeam} fallbackEmoji={match.homeFlag} className="w-full h-full object-cover skew-x-6" /></div>
            }
            <span className={`font-display text-sm sm:text-base uppercase tracking-widest font-black truncate ${isTBD(match.homeTeam) ? 'text-outline-variant opacity-50' : 'text-white'}`}>
              {displayTeam(match.homeTeam)}
            </span>
          </div>
          {prediction && (
            <div className="bg-black/50 border border-white/20 w-8 h-10 sm:w-10 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ml-2 shadow-inner backdrop-blur-md">
              <span className="font-display text-xl sm:text-2xl font-black text-primary drop-shadow-md">
                {prediction.homeGoals}
              </span>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {isTBD(match.awayTeam)
              ? <span className="text-xl opacity-30 text-white font-display font-black w-10 text-center">?</span>
              : <div className="w-10 h-7 sm:w-12 sm:h-8 rounded shadow-md overflow-hidden shrink-0 border border-white/20 bg-black -skew-x-6"><TeamFlag teamName={match.awayTeam} fallbackEmoji={match.awayFlag} className="w-full h-full object-cover skew-x-6" /></div>
            }
            <span className={`font-display text-sm sm:text-base uppercase tracking-widest font-black truncate ${isTBD(match.awayTeam) ? 'text-outline-variant opacity-50' : 'text-white'}`}>
              {displayTeam(match.awayTeam)}
            </span>
          </div>
          {prediction && (
            <div className="bg-black/50 border border-white/20 w-8 h-10 sm:w-10 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ml-2 shadow-inner backdrop-blur-md">
              <span className="font-display text-xl sm:text-2xl font-black text-primary drop-shadow-md">
                {prediction.awayGoals}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Predicted footer */}
      {prediction && (
        <div className="px-3 py-2.5 text-center bg-primary/10 border-t border-primary/20 backdrop-blur-md">
          <span className="font-display text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center justify-center gap-1.5 shadow-neon-primary drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]">
            <span className="material-symbols-outlined text-[14px]">check_circle</span> Locked In
          </span>
        </div>
      )}
    </motion.article>
  );
}
