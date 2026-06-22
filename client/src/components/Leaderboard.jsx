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
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 border-b border-surface-variant pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline-lg font-bold text-on-surface uppercase tracking-tight">Leaderboard</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-label-md uppercase tracking-widest">Total Players: {leaderboard.length}</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {leaderboard.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant text-sm bg-surface-container border border-outline-variant rounded-xl uppercase tracking-widest font-label-md">
            No predictions have been made yet.
          </div>
        ) : (
          leaderboard.map((player, index) => {
            const accuracy = player.totalPlayed > 0 
              ? Math.round((player.exactWins / player.totalPlayed) * 100) 
              : 0;

            let rankColor = "text-primary";
            let rankHighlight = "";
            if (index === 0) {
              rankColor = "text-[#ff5a00]"; // Striker orange for #1
              rankHighlight = "border-l-[4px] border-l-[#ff5a00]";
            } else if (index === 1) {
              rankColor = "text-on-surface"; 
            } else if (index === 2) {
              rankColor = "text-on-surface"; 
            } else {
              rankColor = "text-on-surface-variant";
            }

            const isExpanded = expandedPlayer === player.id;

            return (
              <div key={player.id} className={`bg-surface-container-lowest border border-outline-variant rounded-xl subtle-card-shadow overflow-hidden transition-all duration-300 ${rankHighlight} ${isExpanded ? 'bg-surface-container-low' : ''}`}>
                {/* Minimal Row - Always Visible */}
                <button
                  onClick={() => setExpandedPlayer(isExpanded ? null : player.id)}
                  className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`text-2xl font-bold font-headline-md w-8 text-center flex-shrink-0 ${rankColor}`}>
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-bold text-on-surface truncate font-headline-md tracking-wide">{player.name}</h2>
                      <p className="text-[10px] text-on-surface-variant font-label-sm uppercase tracking-widest mt-1">{player.totalPlayed} preds</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex flex-col items-end justify-center">
                      <span className="text-lg font-display-lg font-bold text-primary tracking-tighter">{player.points} pts</span>
                      <span className="text-[10px] font-label-sm font-medium text-on-surface-variant uppercase">{player.exactWins} perfect</span>
                    </div>
                    <span className={`text-on-surface-variant transition-transform material-symbols-outlined text-[20px] ${isExpanded ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-surface-variant p-4 bg-surface-container-lowest animate-fade-in">
                    <h3 className="text-[10px] font-label-sm font-medium text-on-surface-variant uppercase tracking-widest mb-3">
                      Perfect Predictions ({player.perfectMatches.length})
                    </h3>
                    
                    {player.perfectMatches.length === 0 ? (
                      <p className="text-[10px] text-on-surface-variant font-label-sm uppercase tracking-widest">No exact score predictions yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {player.perfectMatches.map((match, i) => (
                          <div key={i} className="flex items-center justify-between bg-surface border border-outline-variant p-2.5 rounded-md shadow-sm">
                            <span className="text-on-surface font-bold font-headline-md text-sm truncate mr-2 tracking-wide">
                              {match.home} vs {match.away}
                            </span>
                            <span className="bg-[#e6f4ea] text-[#1e4620] border border-[#a3f69c] font-display-lg font-bold px-2 py-0.5 rounded text-xs flex-shrink-0">
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
