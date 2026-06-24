import TeamFlag from './TeamFlag';
import Icon from './Icon';
import { motion } from 'framer-motion';

/**
 * WinnerBanner — functions as a premium sports broadcast Live Score Card.
 */
export default function WinnerBanner({ matches, predictions = [], currentTime = Date.now(), onClick }) {
  // Find live matches first
  const liveMatches = matches
    .filter((m) => m.status === 'live')
    .sort((a, b) => new Date(a.kickoffTime) - new Date(b.kickoffTime));

  const completedMatches = matches
    .filter((m) => m.status === 'completed' && m.winner !== null)
    .sort((a, b) => new Date(b.kickoffTime) - new Date(a.kickoffTime));

  if (!liveMatches.length && !completedMatches.length) return null;

  const isLive = liveMatches.length > 0;
  const matchToDisplay = isLive ? liveMatches[0] : completedMatches[0];
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
      onClick={() => onClick && onClick(matchToDisplay)}
      className="relative overflow-hidden rounded-[2rem] cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] group"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Glow effect matching landing page */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/20 to-transparent blur-3xl group-hover:from-primary/30 transition-colors duration-500" />
      </div>

      <div className="relative z-10 p-6 sm:p-10">
        
        {/* Header - Stadium and Group */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-neon-primary" />
            <span className="font-display tracking-widest text-xs text-white font-black uppercase">
              {matchToDisplay.stadium || 'PINETA STADIUM'}
            </span>
          </div>
          <span className="text-[10px] text-outline-variant font-display uppercase tracking-[0.3em] mt-3 font-bold">
            {matchToDisplay.group || 'Group Stage'}
          </span>
        </div>

        {/* Score display */}
        <div className="flex items-center justify-between">
          
          {/* Home team */}
          <div className="flex-1 flex flex-col items-center gap-4 z-10">
            <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white/5 rounded-2xl p-2 flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md -skew-x-6 group-hover:-skew-x-12 transition-transform duration-500">
              <div className="skew-x-6 group-hover:skew-x-12 w-full h-full rounded-xl overflow-hidden transition-transform duration-500">
                <TeamFlag teamName={matchToDisplay.homeTeam} fallbackEmoji={matchToDisplay.homeFlag} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="font-display text-lg sm:text-2xl text-white tracking-widest font-black uppercase text-center mt-2 drop-shadow-lg">
              {matchToDisplay.homeTeam}
            </div>
            <span className="text-[10px] font-display text-outline-variant tracking-[0.2em] uppercase font-bold">Home</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center justify-center mx-2 sm:mx-8 z-10 shrink-0">
            <div className="flex items-center justify-center gap-4 sm:gap-8 font-display text-6xl sm:text-8xl font-black text-white drop-shadow-[0_0_20px_rgba(0,255,135,0.3)]">
              <span>{matchToDisplay.homeScore ?? 0}</span>
              <span className="text-white/20 text-5xl sm:text-7xl font-light">-</span>
              <span>{matchToDisplay.awayScore ?? 0}</span>
            </div>
            <div className={`mt-6 text-xs sm:text-sm font-display font-black tracking-widest uppercase px-6 py-2 rounded-xl shadow-inner border border-white/10 ${isLive ? 'bg-primary/20 text-primary border-primary/30 shadow-neon-primary' : 'bg-white/10 text-white backdrop-blur-md'}`}>
               {isLive ? displayTime : (isDraw ? 'DRAW' : 'FULL TIME')}
            </div>
          </div>

          {/* Away team */}
          <div className="flex-1 flex flex-col items-center gap-4 z-10">
            <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white/5 rounded-2xl p-2 flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md -skew-x-6 group-hover:-skew-x-12 transition-transform duration-500">
              <div className="skew-x-6 group-hover:skew-x-12 w-full h-full rounded-xl overflow-hidden transition-transform duration-500">
                <TeamFlag teamName={matchToDisplay.awayTeam} fallbackEmoji={matchToDisplay.awayFlag} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="font-display text-lg sm:text-2xl text-white tracking-widest font-black uppercase text-center mt-2 drop-shadow-lg">
              {matchToDisplay.awayTeam}
            </div>
            <span className="text-[10px] font-display text-outline-variant tracking-[0.2em] uppercase font-bold">Away</span>
          </div>
        </div>

        {/* Goal Scorers */}
        {(homeScorers.length > 0 || awayScorers.length > 0) && (
          <div className="flex justify-between items-start mt-10 px-2 sm:px-6 relative z-10 border-t border-white/10 pt-6">
            <div className="flex-1 flex flex-col gap-2 text-white text-xs sm:text-sm font-bold font-display">
              {homeScorers.map(s => (
                <div key={s.player} className="flex items-center gap-3">
                  <Icon name="sports_soccer" className="text-[12px] text-primary" />
                  <span className="truncate max-w-[100px] sm:max-w-[160px] uppercase tracking-wider">{s.player}</span>
                  <span className="text-primary tracking-widest text-[10px] sm:text-xs bg-primary/10 px-2 py-0.5 rounded">{s.times.join(', ')}</span>
                </div>
              ))}
            </div>
            <div className={`flex flex-col justify-center px-4 text-white/30 ${isLive ? 'animate-pulse' : ''}`}>
              <Icon name="sports_score" className="text-3xl" />
            </div>
            <div className="flex-1 flex flex-col gap-2 text-white text-xs sm:text-sm font-bold font-display items-end text-right">
              {awayScorers.map(s => (
                <div key={s.player} className="flex items-center gap-3 justify-end">
                  <span className="text-primary tracking-widest text-[10px] sm:text-xs bg-primary/10 px-2 py-0.5 rounded">{s.times.join(', ')}</span>
                  <span className="truncate max-w-[100px] sm:max-w-[160px] uppercase tracking-wider">{s.player}</span>
                  <Icon name="sports_soccer" className="text-[12px] text-primary" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Match Extras */}
        {!isLive && (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-full pt-6 border-t border-white/10 text-center text-xs">
              <span className="text-outline-variant font-display uppercase tracking-[0.4em] block mb-4 text-[10px] sm:text-xs font-black">
                CORRECT SCORE PREDICTIONS
              </span>
              {correctPredictions.length > 0 ? (
                <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                  {correctPredictions.map((pred) => (
                    <div
                      key={pred._id}
                      className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2 text-white font-bold uppercase tracking-widest shadow-inner border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors"
                    >
                      <span className="text-primary text-[10px] font-black"><Icon name="military_tech" /></span>
                      <span className="text-white drop-shadow-sm truncate max-w-[120px]">{pred.user?.name || 'Legend'}</span>
                      <span className="text-primary font-display text-sm font-black bg-primary/10 px-2 py-0.5 rounded">({pred.homeGoals}-{pred.awayGoals})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-outline-variant uppercase tracking-[0.3em] font-display text-[10px] bg-white/5 border border-white/10 rounded-xl px-6 py-3 inline-block shadow-inner mt-2 font-bold backdrop-blur-md">
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
