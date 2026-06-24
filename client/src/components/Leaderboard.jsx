import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-black/40 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl border-t border-t-white/20">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <span className="material-symbols-outlined text-primary text-[40px] drop-shadow-[0_0_15px_rgba(0,255,135,0.8)]">emoji_events</span>
            <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-widest drop-shadow-md">Global Rankings</h1>
          </div>
          <p className="text-outline-variant text-sm font-body max-w-lg font-bold">The ultimate test of football knowledge. Predict exact scores to maximize your points and climb to the top of the leaderboard.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-6 shadow-inner backdrop-blur-md">
          <div className="text-center">
            <div className="text-3xl font-display font-black text-primary drop-shadow-md">{leaderboard.length}</div>
            <div className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-outline-variant">Players</div>
          </div>
          <div className="w-[1px] h-10 bg-white/20"></div>
          <div className="text-center">
            <div className="text-3xl font-display font-black text-white drop-shadow-md">{predictions.length}</div>
            <div className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-outline-variant">Predictions</div>
          </div>
        </div>
      </motion.div>

      {/* List */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 relative z-10">
        {leaderboard.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-20 text-outline-variant text-base bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl uppercase tracking-widest font-display font-bold">
            No predictions have been made yet.
          </motion.div>
        ) : (
          leaderboard.map((player, index) => {
            const accuracy = player.totalPlayed > 0 
              ? Math.round((player.exactWins / player.totalPlayed) * 100) 
              : 0;

            let rankColor = "text-primary";
            let rankBorder = "border-white/10";
            let rankBg = "bg-white/5";
            let rankGlow = "";

            if (index === 0) {
              rankColor = "text-[#FFD700]"; // Gold
              rankBorder = "border-[#FFD700]/50";
              rankBg = "bg-gradient-to-r from-[#FFD700]/10 to-transparent";
              rankGlow = "drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]";
            } else if (index === 1) {
              rankColor = "text-[#C0C0C0]"; // Silver
              rankBorder = "border-[#C0C0C0]/50";
              rankBg = "bg-gradient-to-r from-[#C0C0C0]/10 to-transparent";
              rankGlow = "drop-shadow-[0_0_10px_rgba(192,192,192,0.5)]";
            } else if (index === 2) {
              rankColor = "text-[#CD7F32]"; // Bronze
              rankBorder = "border-[#CD7F32]/50";
              rankBg = "bg-gradient-to-r from-[#CD7F32]/10 to-transparent";
              rankGlow = "drop-shadow-[0_0_10px_rgba(205,127,50,0.5)]";
            } else {
              rankColor = "text-outline-variant";
            }

            const isExpanded = expandedPlayer === player.id;

            return (
              <motion.div variants={itemVariants} key={player.id} className={`overflow-hidden transition-all duration-300 rounded-2xl border backdrop-blur-xl ${rankBorder} ${isExpanded ? 'shadow-[0_0_30px_rgba(0,255,135,0.15)] bg-white/10 scale-[1.01]' : 'bg-black/40 hover:bg-white/10 hover:border-white/30'}`}>
                {/* Row - Always Visible */}
                <button
                  onClick={() => setExpandedPlayer(isExpanded ? null : player.id)}
                  className={`w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left transition-colors ${rankBg}`}
                >
                  <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                    <div className={`text-4xl md:text-5xl font-black font-display w-12 md:w-16 text-center flex-shrink-0 ${rankColor} ${rankGlow} italic pr-2`}>
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl md:text-2xl font-black text-white truncate font-display tracking-widest uppercase drop-shadow-md">{player.name}</h2>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-outline-variant font-display font-bold uppercase tracking-[0.2em]">{player.totalPlayed} PREDS</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                        <span className="text-xs text-primary font-display font-bold uppercase tracking-[0.2em]">{accuracy}% ACCURACY</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-8 flex-shrink-0">
                    <div className="flex flex-col items-end justify-center">
                      <span className={`text-3xl md:text-5xl font-display font-black tracking-tighter ${index === 0 ? 'text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'text-primary drop-shadow-[0_0_15px_rgba(0,255,135,0.3)]'}`}>{player.points} <span className="text-sm sm:text-lg text-outline-variant ml-1 font-display tracking-widest font-bold">PTS</span></span>
                      <span className="text-[10px] font-display font-black text-white uppercase bg-primary/80 px-2 sm:px-3 py-1 rounded border border-primary/50 mt-1 tracking-widest">{player.exactWins} EXACT</span>
                    </div>
                    <span className={`text-outline-variant transition-transform material-symbols-outlined text-[28px] ${isExpanded ? 'rotate-180 text-primary' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10 bg-black/60 backdrop-blur-md overflow-hidden"
                    >
                      <div className="p-6">
                        <h3 className="text-xs font-display font-black text-outline-variant uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-primary">stars</span> Perfect Predictions ({player.perfectMatches.length})
                        </h3>
                        
                        {player.perfectMatches.length === 0 ? (
                          <p className="text-sm text-outline-variant font-body italic bg-white/5 p-6 rounded-xl border border-white/10 text-center shadow-inner font-bold">No exact score predictions yet. They need to step up their game.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            {player.perfectMatches.map((match, i) => (
                              <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 shadow-inner hover:bg-white/10 transition-colors">
                                <span className="text-white font-black font-display text-sm sm:text-base truncate mr-4 tracking-widest uppercase drop-shadow-md">
                                  {match.home} <span className="text-outline-variant mx-1.5 italic text-sm font-medium">vs</span> {match.away}
                                </span>
                                <span className="bg-primary/20 text-primary border border-primary/30 font-display font-black px-3 py-1.5 rounded-lg text-lg flex-shrink-0 tracking-tighter shadow-neon-primary">
                                  {match.score}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
