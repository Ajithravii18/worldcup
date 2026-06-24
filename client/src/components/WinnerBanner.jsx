import TeamFlag from './TeamFlag';
import Icon from './Icon';

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

  const bannerClass = isLive 
    ? 'bg-gradient-to-br from-[#0a192f] to-[#0d2a45] shadow-neon-primary border-primary/50' 
    : 'glass-panel shadow-subtle-card border-outline-variant/50';

  return (
    <div
      onClick={() => onClick && onClick(matchToDisplay)}
      className={`animate-slide-up overflow-hidden relative rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] border ${bannerClass}`}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0">
        {isLive && <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary opacity-20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>}
        <div className="absolute inset-0 bg-pitch-pattern opacity-[0.15] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 p-5 sm:p-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6 border-b border-outline-variant/30 pb-4">
          <div className="flex items-center gap-4">
            <span className="font-display-lg tracking-[0.1em] text-2xl text-on-surface font-bold uppercase drop-shadow-sm mr-2 flex items-center gap-2">
              <Icon name="sports_score" className="text-primary text-[28px]" />
              MATCH OF THE DAY
            </span>
            {isLive ? (
              <div className="flex items-center gap-2 bg-error/20 border border-error/50 px-3 py-1 rounded shadow-neon-accent">
                <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                <span className="font-label-md tracking-widest text-sm text-error font-bold uppercase">
                  LIVE
                </span>
                <span className="font-label-md tracking-widest text-sm text-error/80 font-bold ml-1">
                  {displayTime}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-white/5 border border-outline-variant/30 px-3 py-1 rounded">
                <span className="font-label-md tracking-widest text-sm text-on-surface font-bold uppercase hidden sm:block">
                  {isDraw ? 'MATCH DRAWN' : 'FINAL SCORE'}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs text-on-surface font-label-md uppercase tracking-widest bg-white border border-outline-variant/30 px-4 py-1.5 rounded shadow-subtle-card hidden sm:block">
            {matchToDisplay.group}
          </span>
        </div>

        {/* Stadium Scoreboard Score display */}
        <div className="flex items-center justify-between bg-white rounded-xl p-4 sm:p-8 relative backdrop-blur-md border border-outline-variant/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          
          {/* Home team */}
          <div className="flex-1 flex flex-col items-center gap-3 sm:gap-5 z-10">
            <TeamFlag teamName={matchToDisplay.homeTeam} fallbackEmoji={matchToDisplay.homeFlag} className="w-16 h-10 sm:w-28 sm:h-16 rounded shadow-md" />
            <div className="font-headline-md text-lg sm:text-2xl text-on-surface tracking-wide font-bold uppercase text-center drop-shadow-md truncate max-w-full px-1">
              {matchToDisplay.homeTeam}
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center justify-center mx-4 sm:mx-8 z-10 bg-white rounded-lg sm:rounded-xl px-5 sm:px-10 py-3 sm:py-5 border-2 border-outline-variant/30 shadow-subtle-card shrink-0">
            <div className="flex items-center justify-center gap-3 sm:gap-8">
              <span className={`font-display-lg text-5xl sm:text-8xl font-bold ${isLive ? 'text-primary drop-shadow-[0_0_15px_rgba(0,255,135,0.6)]' : matchToDisplay.homeScore > matchToDisplay.awayScore ? 'text-on-surface' : matchToDisplay.homeScore < matchToDisplay.awayScore ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                {matchToDisplay.homeScore ?? 0}
              </span>
              <span className="text-outline-variant text-2xl sm:text-5xl font-bold">-</span>
              <span className={`font-display-lg text-5xl sm:text-8xl font-bold ${isLive ? 'text-primary drop-shadow-[0_0_15px_rgba(0,255,135,0.6)]' : matchToDisplay.awayScore > matchToDisplay.homeScore ? 'text-on-surface' : matchToDisplay.awayScore < matchToDisplay.homeScore ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                {matchToDisplay.awayScore ?? 0}
              </span>
            </div>
          </div>

          {/* Away team */}
          <div className="flex-1 flex flex-col items-center gap-3 sm:gap-5 z-10">
            <TeamFlag teamName={matchToDisplay.awayTeam} fallbackEmoji={matchToDisplay.awayFlag} className="w-16 h-10 sm:w-28 sm:h-16 rounded shadow-md" />
            <div className="font-headline-md text-lg sm:text-2xl text-on-surface tracking-wide font-bold uppercase text-center drop-shadow-md truncate max-w-full px-1">
              {matchToDisplay.awayTeam}
            </div>
          </div>
        </div>

        {/* Goal Scorers */}
        {(homeScorers.length > 0 || awayScorers.length > 0) && (
          <div className="flex justify-between items-start mt-4 px-2 sm:px-8 relative z-10 border-t border-outline-variant/30 pt-4">
            <div className="flex-1 flex flex-col gap-1.5 text-on-surface text-sm sm:text-base font-medium">
              {homeScorers.map(s => (
                <div key={s.player} className="flex items-center gap-2">
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">{s.player}</span>
                  <span className="text-primary text-xs sm:text-sm font-label-md uppercase">{s.times.join(', ')}</span>
                </div>
              ))}
            </div>
            <div className={`flex flex-col justify-center px-4 text-on-surface-variant ${isLive ? 'animate-pulse' : ''}`}>
              <span className="text-sm sm:text-base opacity-50">⚽</span>
            </div>
            <div className="flex-1 flex flex-col gap-1.5 text-on-surface text-sm sm:text-base font-medium items-end text-right">
              {awayScorers.map(s => (
                <div key={s.player} className="flex items-center gap-2 justify-end">
                  <span className="text-primary text-xs sm:text-sm font-label-md uppercase">{s.times.join(', ')}</span>
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">{s.player}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Match Extras */}
        {!isLive && (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-full pt-5 border-t border-outline-variant/30 text-center text-xs bg-white rounded-xl p-5 border border-outline-variant/20">
              <span className="text-secondary font-label-md uppercase tracking-[0.2em] block mb-4 text-sm drop-shadow-md">
                CORRECT SCORE PREDICTIONS
              </span>
              {correctPredictions.length > 0 ? (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {correctPredictions.map((pred) => (
                    <div
                      key={pred._id}
                      className="flex items-center gap-2 bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/50 rounded px-4 py-2 text-secondary font-bold uppercase tracking-widest shadow-sm"
                    >
                      <span className="text-on-surface">{pred.user?.name || 'Legend'}</span>
                      <span className="text-secondary font-display-lg text-lg">({pred.homeGoals}-{pred.awayGoals})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-on-surface-variant uppercase tracking-widest font-label-md bg-white rounded px-5 py-3 border border-outline-variant/30 inline-block shadow-subtle-card">
                  NO ONE PREDICTED THIS SCORE CORRECTLY
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
