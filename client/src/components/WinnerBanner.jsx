import TeamFlag from './TeamFlag';
import Icon from './Icon';
import { motion } from 'framer-motion';

/**
 * WinnerBanner — functions as a premium sports broadcast Live Score Card.
 */
export default function WinnerBanner({ matches, predictions = [], currentTime = Date.now(), onClick }) {
  // Find the most relevant match to display:
  // 1. A live match
  // 2. The most recently completed match
  // 3. The closest upcoming match
  let matchToDisplay = null;
  if (matches && matches.length > 0) {
    const liveMatches = matches.filter(m => m.status === 'live');
    if (liveMatches.length > 0) {
      matchToDisplay = liveMatches.sort((a, b) => new Date(b.kickoffTime) - new Date(a.kickoffTime))[0];
    } else {
      const completedMatches = matches.filter(m => m.status === 'completed');
      if (completedMatches.length > 0) {
        matchToDisplay = completedMatches.sort((a, b) => new Date(b.kickoffTime) - new Date(a.kickoffTime))[0];
      } else {
        const upcomingMatches = matches.filter(m => m.status === 'upcoming');
        matchToDisplay = upcomingMatches.sort((a, b) => new Date(a.kickoffTime) - new Date(b.kickoffTime))[0] || matches[0];
      }
    }
  }

  if (!matchToDisplay) return null;

  const isLive = matchToDisplay.status === 'live';
  const isDraw = !isLive && matchToDisplay.winner === 'Draw';

  // Calculate elapsed time for live matches
  let displayTime = '';
  if (isLive) {
    if (matchToDisplay.shortStatus && matchToDisplay.shortStatus !== '1H' && matchToDisplay.shortStatus !== '2H') {
      displayTime = matchToDisplay.shortStatus; 
    } else if (matchToDisplay.elapsed) {
      displayTime = `${matchToDisplay.elapsed}'`;
    } else {
      const kickoff = new Date(matchToDisplay.kickoffTime).getTime();
      let elapsedMinutes = Math.floor((currentTime - kickoff) / 60000);
      if (elapsedMinutes < 0) elapsedMinutes = 0;
      if (elapsedMinutes > 120) elapsedMinutes = '120+';
      displayTime = `${elapsedMinutes}'`;
    }
  }

  // Group scorers by team
  const homeScorersMap = {};
  const awayScorersMap = {};

  (matchToDisplay.events || []).forEach(e => {
    if (!e.player) return;
    
    const isOwnGoal = e.detail && e.detail.toLowerCase().includes('own');
    const timeStr = e.extra ? `${e.time}+${e.extra}'` : `${e.time}'`;
    const playerStr = isOwnGoal ? `${e.player} (OG)` : e.player;
    
    let isHome = e.team?.toLowerCase() === matchToDisplay.homeTeam.toLowerCase();
    let isAway = e.team?.toLowerCase() === matchToDisplay.awayTeam.toLowerCase();
    
    if (isOwnGoal) {
      const temp = isHome;
      isHome = isAway;
      isAway = temp;
    }
    
    if (isHome) {
      if (!homeScorersMap[playerStr]) homeScorersMap[playerStr] = [];
      homeScorersMap[playerStr].push(timeStr);
    } else if (isAway) {
      if (!awayScorersMap[playerStr]) awayScorersMap[playerStr] = [];
      awayScorersMap[playerStr].push(timeStr);
    }
  });

  const homeScorers = Object.entries(homeScorersMap).map(([player, times]) => ({ player, times }));
  const awayScorers = Object.entries(awayScorersMap).map(([player, times]) => ({ player, times }));

  // Hardcode fallback for Colombia vs DR Congo as requested
  if (matchToDisplay.homeTeam === 'Colombia' && matchToDisplay.awayTeam === 'DR Congo' && homeScorers.length === 0) {
    homeScorers.push({ player: 'L. Díaz', times: ["34'"] });
  }

  const correctPredictions = !isLive ? predictions.filter(
    (p) =>
      (p.match?._id === matchToDisplay._id || p.match === matchToDisplay._id) &&
      p.homeGoals === matchToDisplay.homeScore &&
      p.awayGoals === matchToDisplay.awayScore
  ) : [];

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -5 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="relative w-full h-full overflow-hidden rounded-[2rem] cursor-pointer bg-surface border border-surface-variant shadow-lg group"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Glow effect matching landing page */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/20 to-transparent blur-3xl group-hover:from-primary/30 transition-colors duration-500" />
      </div>

      <div className="relative z-10 p-4 sm:p-6">
        
        {/* Header - Stadium and Group */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-surface-variant">
            <Icon name="military_tech" className="text-tertiary text-sm sm:text-base animate-pulse-fast drop-shadow-md" data-weight="fill" />
            <span className="font-display tracking-widest text-xs text-white font-black uppercase">
              {matchToDisplay.stadium || 'PINETA STADIUM'}
            </span>
          </div>
          <span className="text-[10px] text-outline-variant font-display uppercase tracking-[0.3em] mt-3 font-bold">
            {matchToDisplay.group || 'Group Stage'}
          </span>
        </div>

        {/* Score display */}
        <div className="flex items-center justify-between mt-12">
          
          {/* Home team */}
          <div className="flex-1 flex flex-col items-center gap-2 sm:gap-4 z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface-variant rounded-2xl p-2 flex items-center justify-center border border-surface-variant -skew-x-6 group-hover:-skew-x-12 transition-transform duration-500">
              <div className="skew-x-6 group-hover:skew-x-12 w-full h-full rounded-xl overflow-hidden transition-transform duration-500">
                <TeamFlag teamName={matchToDisplay.homeTeam} fallbackEmoji={matchToDisplay.homeFlag} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="font-display text-lg sm:text-2xl text-white tracking-widest font-black uppercase text-center mt-2">
              {matchToDisplay.homeTeam}
            </div>
            <span className="text-[10px] font-display text-outline-variant tracking-[0.2em] uppercase font-bold">Home</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center justify-center mx-2 sm:mx-6 z-10 shrink-0">
            <div className="flex items-center justify-center gap-4 sm:gap-6 font-display text-5xl sm:text-6xl font-black text-white">
              <span>{matchToDisplay.homeScore ?? 0}</span>
              <span className="text-white/20 text-4xl sm:text-5xl font-light">-</span>
              <span>{matchToDisplay.awayScore ?? 0}</span>
            </div>
            <div className={`mt-6 text-xs sm:text-sm font-display font-black tracking-widest uppercase px-6 py-2 rounded-xl shadow-inner border border-surface-variant ${isLive ? 'bg-primary/20 text-primary border-primary/30' : 'bg-surface-variant text-white'}`}>
               {isLive ? displayTime : (isDraw ? 'DRAW' : 'FULL TIME')}
            </div>
          </div>

          {/* Away team */}
          <div className="flex-1 flex flex-col items-center gap-2 sm:gap-4 z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface-variant rounded-2xl p-2 flex items-center justify-center border border-surface-variant -skew-x-6 group-hover:-skew-x-12 transition-transform duration-500">
              <div className="skew-x-6 group-hover:skew-x-12 w-full h-full rounded-xl overflow-hidden transition-transform duration-500">
                <TeamFlag teamName={matchToDisplay.awayTeam} fallbackEmoji={matchToDisplay.awayFlag} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="font-display text-lg sm:text-2xl text-white tracking-widest font-black uppercase text-center mt-2">
              {matchToDisplay.awayTeam}
            </div>
            <span className="text-[10px] font-display text-outline-variant tracking-[0.2em] uppercase font-bold">Away</span>
          </div>
        </div>

        {/* Goal Scorers */}
        {(homeScorers.length > 0 || awayScorers.length > 0) && (
          <div className="flex justify-between items-start mt-4 px-2 sm:px-6 relative z-10 border-t border-surface-variant pt-4">
            <div className="flex-1 flex flex-col gap-2 text-white text-xs sm:text-sm font-bold font-display">
              {homeScorers.map(s => (
                <div key={s.player} className="flex items-center gap-3">
                  <Icon name="sports_soccer" className="text-[12px] text-primary" />
                  <span className="truncate max-w-[100px] sm:max-w-[160px] uppercase tracking-wider">{s.player}</span>
                  <span className="text-primary tracking-widest text-[10px] sm:text-xs bg-surface-variant px-2 py-0.5 rounded">{s.times.join(', ')}</span>
                </div>
              ))}
            </div>
            <div className={`flex flex-col justify-center px-4 text-white/30 ${isLive ? 'animate-pulse' : ''}`}>
              <Icon name="sports_score" className="text-3xl" />
            </div>
            <div className="flex-1 flex flex-col gap-2 text-white text-xs sm:text-sm font-bold font-display items-end text-right">
              {awayScorers.map(s => (
                <div key={s.player} className="flex items-center gap-3 justify-end">
                  <span className="text-primary tracking-widest text-[10px] sm:text-xs bg-surface-variant px-2 py-0.5 rounded">{s.times.join(', ')}</span>
                  <span className="truncate max-w-[100px] sm:max-w-[160px] uppercase tracking-wider">{s.player}</span>
                  <Icon name="sports_soccer" className="text-[12px] text-primary" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Match Extras */}
        {!isLive && (
          <div className="mt-4 flex flex-col items-center">
            <div className="w-full pt-4 border-t border-surface-variant text-center text-xs">
              <span className="text-outline-variant font-display uppercase tracking-[0.4em] block mb-4 text-[10px] sm:text-xs font-black">
                CORRECT SCORE PREDICTIONS
              </span>
              {correctPredictions.length > 0 ? (
                <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                  {correctPredictions.map((pred) => (
                    <div
                      key={pred._id}
                      className="flex items-center gap-3 bg-surface-variant rounded-xl px-4 py-2 text-white font-bold uppercase tracking-widest border border-outline-variant/20"
                    >
                      <span className="text-primary text-[10px] font-black"><Icon name="military_tech" /></span>
                      <span className="text-white truncate max-w-[120px]">{pred.user?.name || 'Legend'}</span>
                      <span className="text-primary font-display text-sm font-black bg-primary/10 px-2 py-0.5 rounded">({pred.homeGoals}-{pred.awayGoals})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-outline-variant uppercase tracking-[0.3em] font-display text-[10px] bg-surface-variant border border-surface-variant rounded-xl px-6 py-3 inline-block shadow-inner mt-2 font-bold">
                  NO ONE PREDICTED THIS SCORE CORRECTLY
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
