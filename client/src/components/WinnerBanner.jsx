import TeamFlag from './TeamFlag';

/**
 * WinnerBanner — functions as a Google-style Live Score Card.
 * Prioritizes showing LIVE matches. If no match is live, shows the most recent completed match.
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
      displayTime = matchToDisplay.shortStatus; // e.g. HT, PEN, BT, etc.
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
    
    // Check which team scored (support partial match in case API string differs slightly)
    let isHome = e.team?.toLowerCase() === matchToDisplay.homeTeam.toLowerCase();
    let isAway = e.team?.toLowerCase() === matchToDisplay.awayTeam.toLowerCase();
    
    // If it's an own goal, it should be listed under the team that benefited (the OTHER team)
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

  // Find who predicted this match exactly correct (only relevant for completed matches)
  const correctPredictions = !isLive ? predictions.filter(
    (p) =>
      (p.match?._id === matchToDisplay._id || p.match === matchToDisplay._id) &&
      p.homeGoals === matchToDisplay.homeScore &&
      p.awayGoals === matchToDisplay.awayScore
  ) : [];

  if (isLive) {
    return (
      <div
        id="winner-banner-live"
        onClick={() => onClick && onClick(matchToDisplay)}
        className="animate-slide-up mx-4 mb-8 overflow-hidden relative rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)', // Vibrant blue
        }}
      >
        {/* Subtle grid to look like physical LED panels */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,0.1)_2px,transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:6px_6px]" />

        <div className="relative p-5">
          {/* Header row */}
          <div className="flex items-center justify-between mb-4 border-b border-white/20 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-display tracking-[0.2em] text-sm text-white font-black uppercase drop-shadow-md mr-2">
                MATCH OF THE DAY
              </span>
              <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full shadow-md">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                <span className="font-display tracking-widest text-[11px] text-white font-bold uppercase">
                  LIVE
                </span>
                <span className="font-display tracking-widest text-[11px] text-red-100 font-bold ml-1">
                  {displayTime}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-white font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full hidden sm:block">
              {matchToDisplay.group}
            </span>
          </div>

          {/* Stadium Scoreboard Score display */}
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-6 relative backdrop-blur-sm border border-white/20">
            
            {/* Home team */}
            <div className="flex-1 flex flex-col items-center gap-4 z-10">
              <TeamFlag teamName={matchToDisplay.homeTeam} fallbackEmoji={matchToDisplay.homeFlag} className="w-20 h-14 rounded-md shadow-sm" />
              <div className="font-display text-lg sm:text-xl text-white tracking-[0.1em] font-bold uppercase text-center drop-shadow-sm">
                {matchToDisplay.homeTeam}
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center justify-center mx-4 sm:mx-6 z-10 bg-white rounded-2xl px-6 sm:px-8 py-4 shadow-xl">
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <span className="font-display text-5xl sm:text-7xl text-gray-900 font-black">
                  {matchToDisplay.homeScore ?? 0}
                </span>
                <span className="text-gray-300 text-3xl sm:text-4xl font-light">-</span>
                <span className="font-display text-5xl sm:text-7xl text-gray-900 font-black">
                  {matchToDisplay.awayScore ?? 0}
                </span>
              </div>
            </div>

            {/* Away team */}
            <div className="flex-1 flex flex-col items-center gap-4 z-10">
              <TeamFlag teamName={matchToDisplay.awayTeam} fallbackEmoji={matchToDisplay.awayFlag} className="w-20 h-14 rounded-md shadow-sm" />
              <div className="font-display text-lg sm:text-xl text-white tracking-[0.1em] font-bold uppercase text-center drop-shadow-sm">
                {matchToDisplay.awayTeam}
              </div>
            </div>
          </div>

          {/* Goal Scorers (Live) */}
          {(homeScorers.length > 0 || awayScorers.length > 0) && (
            <div className="flex justify-between items-start mt-3 px-2 sm:px-6 relative z-10 border-t border-white/10 pt-3">
              <div className="flex-1 flex flex-col gap-1 text-white/90 text-xs sm:text-sm font-medium">
                {homeScorers.map(s => (
                  <div key={s.player} className="flex items-center gap-1.5">
                    <span className="truncate max-w-[120px] sm:max-w-[200px]">{s.player}</span>
                    <span className="text-white/60 text-[10px] sm:text-xs pt-[1px] font-mono">{s.times.join(', ')}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center px-4 text-white/50 animate-pulse">
                <span className="text-[10px] sm:text-xs text-white/30">⚽</span>
              </div>
              <div className="flex-1 flex flex-col gap-1 text-white/90 text-xs sm:text-sm font-medium items-end text-right">
                {awayScorers.map(s => (
                  <div key={s.player} className="flex items-center gap-1.5 justify-end">
                    <span className="text-white/60 text-[10px] sm:text-xs pt-[1px] font-mono">{s.times.join(', ')}</span>
                    <span className="truncate max-w-[120px] sm:max-w-[200px]">{s.player}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      id="winner-banner"
      onClick={() => onClick && onClick(matchToDisplay)}
      className="animate-slide-up mx-4 mb-8 overflow-hidden relative rounded-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)', // Vibrant blue
      }}
    >
      {/* Subtle grid to look like physical LED panels */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,0.1)_2px,transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:6px_6px]" />

      <div className="relative p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4 border-b border-white/20 pb-3">
          <div className="flex items-center gap-3">
            <span className="font-display tracking-[0.2em] text-sm text-white font-black uppercase drop-shadow-md mr-2">
              MATCH OF THE DAY
            </span>
            <div className={`flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full shadow-sm`}>
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <span className="font-display tracking-widest text-[11px] text-white font-bold uppercase hidden sm:block">
                {isDraw ? 'MATCH DRAWN' : 'FINAL SCORE'}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-white font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full hidden sm:block">
            {matchToDisplay.group}
          </span>
        </div>

        {/* Stadium Scoreboard Score display */}
        <div className="flex items-center justify-between bg-white/10 rounded-xl p-6 relative backdrop-blur-sm border border-white/20">
          {/* Home team */}
          <div className="flex-1 flex flex-col items-center gap-4 z-10">
            <TeamFlag teamName={matchToDisplay.homeTeam} fallbackEmoji={matchToDisplay.homeFlag} className="w-20 h-14 rounded-md shadow-sm" />
            <div className="font-display text-lg sm:text-xl text-white tracking-[0.1em] font-bold uppercase text-center drop-shadow-md">
              {matchToDisplay.homeTeam}
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center justify-center mx-4 sm:mx-6 z-10 bg-white rounded-2xl px-6 sm:px-8 py-4 shadow-xl">
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <span className={`font-display text-5xl sm:text-7xl font-black ${matchToDisplay.homeScore > matchToDisplay.awayScore ? 'text-gray-900' : matchToDisplay.homeScore < matchToDisplay.awayScore ? 'text-gray-300' : 'text-gray-600'}`}>
                {matchToDisplay.homeScore ?? 0}
              </span>
              <span className="text-gray-300 text-3xl sm:text-4xl font-light">-</span>
              <span className={`font-display text-5xl sm:text-7xl font-black ${matchToDisplay.awayScore > matchToDisplay.homeScore ? 'text-gray-900' : matchToDisplay.awayScore < matchToDisplay.homeScore ? 'text-gray-300' : 'text-gray-600'}`}>
                {matchToDisplay.awayScore ?? 0}
              </span>
            </div>
          </div>

          {/* Away team */}
          <div className="flex-1 flex flex-col items-center gap-4 z-10">
            <TeamFlag teamName={matchToDisplay.awayTeam} fallbackEmoji={matchToDisplay.awayFlag} className="w-20 h-14 rounded-md shadow-sm" />
            <div className="font-display text-lg sm:text-xl text-white tracking-[0.1em] font-bold uppercase text-center drop-shadow-md">
              {matchToDisplay.awayTeam}
            </div>
          </div>
        </div>

        {/* Goal Scorers (Completed) */}
        {(homeScorers.length > 0 || awayScorers.length > 0) && (
          <div className="flex justify-between items-start mt-3 px-2 sm:px-6 relative z-10 border-t border-white/10 pt-3 mb-2">
            <div className="flex-1 flex flex-col gap-1 text-white/90 text-xs sm:text-sm font-medium">
              {homeScorers.map(s => (
                <div key={s.player} className="flex items-center gap-1.5">
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">{s.player}</span>
                  <span className="text-white/60 text-[10px] sm:text-xs pt-[1px] font-mono">{s.times.join(', ')}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center px-4 text-white/50">
              <span className="text-[10px] sm:text-xs text-white/30">⚽</span>
            </div>
            <div className="flex-1 flex flex-col gap-1 text-white/90 text-xs sm:text-sm font-medium items-end text-right">
              {awayScorers.map(s => (
                <div key={s.player} className="flex items-center gap-1.5 justify-end">
                  <span className="text-white/60 text-[10px] sm:text-xs pt-[1px] font-mono">{s.times.join(', ')}</span>
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">{s.player}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Match Extras */}
        <div className="mt-6 flex flex-col items-center">
          {/* Winner highlight */}
          {!isDraw && matchToDisplay.winner && (
            <div className="flex items-center gap-2 mb-4 animate-pulse">
              <span className="text-xl">🏆</span>
              <span className="font-display text-[12px] sm:text-sm uppercase tracking-[0.2em] text-white font-bold drop-shadow-md">
                WINNER: {matchToDisplay.winner}
              </span>
              <span className="text-xl">🏆</span>
            </div>
          )}

          {/* Prediction Winners Section */}
          <div className="w-full pt-4 border-t border-white/20 text-center text-[10px] bg-black/10 rounded-xl p-4 mt-2">
            <span className="text-white/80 font-bold uppercase tracking-[0.2em] block mb-3">
              CORRECT SCORE PREDICTIONS
            </span>
            {correctPredictions.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {correctPredictions.map((pred) => (
                  <div
                    key={pred._id}
                    className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-gray-900 font-bold uppercase tracking-widest shadow-sm"
                  >
                    <span className="text-gray-900">{pred.user?.name || 'Legend'}</span>
                    <span className="text-theme-primary">({pred.homeGoals}-{pred.awayGoals})</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-white/90 uppercase tracking-widest font-bold bg-white/10 rounded-full px-4 py-2 border border-white/20 inline-block">
                NO ONE PREDICTED THIS SCORE CORRECTLY
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
