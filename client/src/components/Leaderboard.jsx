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
      <div className="mb-6 border-b border-white/10 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider font-display drop-shadow">Players & Predictions</h1>
          <p className="text-fm-muted mt-2 text-sm font-bold uppercase tracking-widest font-mono">Total Players: {leaderboard.length}</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {leaderboard.length === 0 ? (
          <div className="text-center py-16 text-fm-muted text-xs glass-card uppercase tracking-widest font-bold">
            No predictions have been made yet.
          </div>
        ) : (
          leaderboard.map((player, index) => {
            const accuracy = player.totalPlayed > 0 
              ? Math.round((player.exactWins / player.totalPlayed) * 100) 
              : 0;

            let rankColor = "text-fm-gold";
            let rankGlow = "";
            let rankHighlight = "";
            if (index === 0) {
              rankColor = "text-fm-orange"; // Striker orange for #1
              rankGlow = "drop-shadow-[0_0_8px_rgba(236,106,6,0.6)]";
              rankHighlight = "border-l-[4px] border-l-fm-orange";
            } else if (index === 1) {
              rankColor = "text-[#e2e8f0]"; // Silver
            } else if (index === 2) {
              rankColor = "text-[#b45309]"; // Bronze
            } else {
              rankColor = "text-fm-muted";
            }

            const isExpanded = expandedPlayer === player.id;

            return (
              <div key={player.id} className={`glass-card overflow-hidden transition-all duration-300 ${rankHighlight} ${isExpanded ? 'bg-white/10' : ''}`}>
                {/* Minimal Row - Always Visible */}
                <button
                  onClick={() => setExpandedPlayer(isExpanded ? null : player.id)}
                  className="w-full p-4 flex items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`text-2xl font-black font-display w-8 text-center flex-shrink-0 ${rankColor} ${rankGlow}`}>
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-bold text-white truncate font-display tracking-wide">{player.name}</h2>
                      <p className="text-[10px] text-fm-muted font-mono uppercase tracking-widest mt-1">{player.totalPlayed} preds</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex flex-col items-end justify-center">
                      <span className="text-lg font-mono font-bold text-fm-green drop-shadow-[0_0_2px_rgba(75,226,119,0.5)]">{player.points} pts</span>
                      <span className="text-[10px] font-mono font-medium text-fm-muted uppercase">{player.exactWins} perfect</span>
                    </div>
                    <span className={`text-fm-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-white/10 p-4 bg-black/20 animate-fade-in">
                    <h3 className="text-[10px] font-mono font-medium text-fm-muted uppercase tracking-widest mb-3">
                      Perfect Predictions ({player.perfectMatches.length})
                    </h3>
                    
                    {player.perfectMatches.length === 0 ? (
                      <p className="text-[10px] text-fm-muted font-mono uppercase tracking-widest">No exact score predictions yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {player.perfectMatches.map((match, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 p-2.5 rounded-md shadow-sm">
                            <span className="text-white font-bold font-display text-sm truncate mr-2 tracking-wide">
                              {match.home} vs {match.away}
                            </span>
                            <span className="bg-fm-green/10 text-fm-green border border-fm-green/30 font-mono font-bold px-2 py-0.5 rounded text-xs flex-shrink-0">
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
