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
      <div className="mb-6 border-b border-gray-200 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider font-display">Players & Predictions</h1>
          <p className="text-gray-500 mt-2 text-sm font-bold uppercase tracking-widest">Total Players: {leaderboard.length}</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {leaderboard.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-[10px] bg-white rounded-xl border border-gray-200 uppercase tracking-widest font-bold">
            No predictions have been made yet.
          </div>
        ) : (
          leaderboard.map((player, index) => {
            const accuracy = player.totalPlayed > 0 
              ? Math.round((player.exactWins / player.totalPlayed) * 100) 
              : 0;

            let rankColor = "text-yellow-500";
            if (index === 0) rankColor = "text-yellow-500 drop-shadow-sm"; // Gold
            else if (index === 1) rankColor = "text-gray-400 drop-shadow-sm"; // Silver
            else if (index === 2) rankColor = "text-orange-500 drop-shadow-sm"; // Bronze
            else rankColor = "text-theme-primary/50";

            const isExpanded = expandedPlayer === player.id;

            return (
              <div key={player.id} className={`border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 ${
                index === 0 
                  ? 'bg-gradient-to-r from-yellow-50 to-amber-50/80 border-yellow-300 shadow-sm' 
                  : 'bg-white border-gray-200'
              }`}>
                {/* Minimal Row - Always Visible */}
                <button
                  onClick={() => setExpandedPlayer(isExpanded ? null : player.id)}
                  className="w-full p-4 flex items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`text-lg font-black font-display w-8 text-center flex-shrink-0 ${rankColor}`}>
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-bold text-gray-900 truncate font-display uppercase">{player.name}</h2>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{player.totalPlayed} preds</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex flex-col items-end justify-center pr-2">
                      <span className="text-sm font-black text-theme-secondary drop-shadow-sm">{player.points} pts</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{player.exactWins} perfect</span>
                    </div>
                    <span className={`text-theme-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className={`border-t p-4 animate-fade-in ${
                    index === 0 ? 'border-yellow-200 bg-yellow-50/50' : 'border-gray-100 bg-gray-50'
                  }`}>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                      Perfect Predictions ({player.perfectMatches.length})
                    </h3>
                    
                    {player.perfectMatches.length === 0 ? (
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No exact score predictions yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {player.perfectMatches.map((match, i) => (
                          <div key={i} className="flex items-center justify-between bg-white border border-gray-200 p-2 rounded-lg text-xs shadow-sm">
                            <span className="text-gray-800 font-bold font-display uppercase text-[10px] truncate mr-2 tracking-wider">
                              {match.home} vs {match.away}
                            </span>
                            <span className="bg-blue-50 text-theme-primary font-black px-2 py-0.5 rounded-full text-[10px] flex-shrink-0">
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
