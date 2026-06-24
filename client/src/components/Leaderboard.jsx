import React, { useState } from 'react';

export default function LeaderboardView({ predictions = [] }) {
  const [expandedPlayer, setExpandedPlayer] = useState(null);

  // Aggregate predictions by user
  const stats = {};

  predictions.forEach((p) => {
    if (!p.user) return;
    
    // Ensure we have a string ID and a name
    const userId = typeof p.user === 'object' ? p.user._id : p.user;
    const userName = (typeof p.user === 'object' && p.user.name) ? p.user.name : 'Unknown Player';

    if (!stats[userId]) {
      stats[userId] = {
        id: userId,
        name: userName,
        totalPlayed: 0,
        exactWins: 0,
        points: 0,
        perfectMatches: []
      };
    }

    stats[userId].totalPlayed += 1;

    // Check if prediction was a perfect match
    if (p.match && p.match.status === 'completed') {
      stats[userId].points += (p.points || 0);

      const isPerfect = p.homeGoals === p.match.homeScore && p.awayGoals === p.match.awayScore;
      if (isPerfect) {
        stats[userId].exactWins += 1;
        stats[userId].perfectMatches.push({
          home: p.match.homeTeam,
          away: p.match.awayTeam,
          score: `${p.homeGoals} - ${p.awayGoals}`
        });
      }
    }
  });

  // Sort: highest points first, then highest exact wins, then highest total played
  const leaderboard = Object.values(stats).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.exactWins !== a.exactWins) return b.exactWins - a.exactWins;
    return b.totalPlayed - a.totalPlayed;
  });

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8 border-b border-outline-variant/50 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-secondary text-[32px]">emoji_events</span>
            <h1 className="text-4xl md:text-5xl font-headline-lg font-bold text-on-surface uppercase tracking-wide">Global Rankings</h1>
          </div>
          <p className="text-on-surface-variant text-sm font-body-md max-w-lg">The ultimate test of football knowledge. Predict exact scores to maximize your points and climb to the top of the leaderboard.</p>
        </div>
        <div className="bg-white border border-outline-variant/30 px-5 py-3 rounded-lg flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-display-lg font-bold text-primary">{leaderboard.length}</div>
            <div className="text-[10px] font-label-sm uppercase tracking-widest text-on-surface-variant">Players</div>
          </div>
          <div className="w-[1px] h-8 bg-outline-variant/30"></div>
          <div className="text-center">
            <div className="text-2xl font-display-lg font-bold text-secondary">{predictions.length}</div>
            <div className="text-[10px] font-label-sm uppercase tracking-widest text-on-surface-variant">Predictions</div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4 relative z-10">
        {leaderboard.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant text-base glass-panel rounded-2xl uppercase tracking-widest font-label-md">
            No predictions have been made yet.
          </div>
        ) : (
          leaderboard.map((player, index) => {
            const accuracy = player.totalPlayed > 0 
              ? Math.round((player.exactWins / player.totalPlayed) * 100) 
              : 0;

            let rankColor = "text-primary";
            let rankBorder = "border-outline-variant/30";
            let rankBg = "bg-white";
            let rankGlow = "";

            if (index === 0) {
              rankColor = "text-secondary"; // Gold
              rankBorder = "border-secondary/50";
              rankBg = "bg-gradient-to-r from-secondary/10 to-transparent";
              rankGlow = "drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]";
            } else if (index === 1) {
              rankColor = "text-[#c0c0c0]"; // Silver
              rankBorder = "border-[#c0c0c0]/50";
              rankBg = "bg-gradient-to-r from-[#c0c0c0]/10 to-transparent";
            } else if (index === 2) {
              rankColor = "text-[#cd7f32]"; // Bronze
              rankBorder = "border-[#cd7f32]/50";
              rankBg = "bg-gradient-to-r from-[#cd7f32]/10 to-transparent";
            } else {
              rankColor = "text-on-surface-variant";
            }

            const isExpanded = expandedPlayer === player.id;

            return (
              <div key={player.id} className={`glass-panel overflow-hidden transition-all duration-300 rounded-xl border ${rankBorder} ${isExpanded ? 'shadow-neon-primary scale-[1.01]' : 'hover:border-primary/50'}`}>
                {/* Row - Always Visible */}
                <button
                  onClick={() => setExpandedPlayer(isExpanded ? null : player.id)}
                  className={`w-full p-5 flex items-center justify-between gap-4 text-left transition-colors ${rankBg} hover:bg-surface-variant`}
                >
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className={`text-4xl md:text-5xl font-bold font-display-lg w-12 md:w-16 text-center flex-shrink-0 ${rankColor} ${rankGlow}`}>
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-on-surface truncate font-headline-md tracking-wide">{player.name}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-on-surface-variant font-label-sm uppercase tracking-widest">{player.totalPlayed} PREDS</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant/50"></span>
                        <span className="text-xs text-primary font-label-sm uppercase tracking-widest">{accuracy}% ACCURACY</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="flex flex-col items-end justify-center">
                      <span className={`text-3xl md:text-4xl font-display-lg font-bold tracking-tighter ${index === 0 ? 'text-secondary drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' : 'text-primary'}`}>{player.points} <span className="text-lg text-on-surface-variant ml-1 font-headline-md">PTS</span></span>
                      <span className="text-[10px] font-label-sm font-medium text-on-surface-variant uppercase bg-white px-2 py-0.5 rounded border border-outline-variant/30">{player.exactWins} EXACT</span>
                    </div>
                    <span className={`text-on-surface-variant transition-transform material-symbols-outlined text-[24px] ${isExpanded ? 'rotate-180 text-primary' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-outline-variant/30 p-6 bg-white animate-fade-in">
                    <h3 className="text-xs font-label-sm text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">stars</span> Perfect Predictions ({player.perfectMatches.length})
                    </h3>
                    
                    {player.perfectMatches.length === 0 ? (
                      <p className="text-sm text-on-surface-variant font-body-md italic bg-white p-4 rounded-lg border border-outline-variant/20 text-center">No exact score predictions yet. They need to step up their game.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {player.perfectMatches.map((match, i) => (
                          <div key={i} className="flex items-center justify-between glass-panel p-3 rounded-lg shadow-sm">
                            <span className="text-on-surface font-bold font-headline-md text-base truncate mr-3 tracking-wide">
                              {match.home} <span className="text-outline-variant mx-1 italic text-sm">vs</span> {match.away}
                            </span>
                            <span className="bg-primary/10 text-primary border border-primary/30 font-display-lg font-bold px-3 py-1 rounded text-xl flex-shrink-0 tracking-tighter shadow-[inset_0_0_8px_rgba(0,255,135,0.2)]">
                              {match.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
