import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
import Icon from './Icon';

export default function HeroLanding({ predictions = [] }) {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  let totalPoints = 0;
  let exactWins = 0;
  let matchesPlayed = 0;

  if (user) {
    predictions.forEach(p => {
      const pUserId = typeof p.user === 'object' ? p.user._id : p.user;
      if (pUserId === user._id && p.match?.status === 'completed') {
        matchesPlayed++;
        totalPoints += (p.points || 0);
        if (p.homeGoals === p.match.homeScore && p.awayGoals === p.match.awayScore) {
          exactWins++;
        }
      }
    });
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] bg-gradient-to-br from-white/5 via-black/60 to-primary/5 hover:border-primary/20 transition-colors duration-500 p-4 md:p-6"
    >
      {/* Decorative Neon Glimmers */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Premium Diagonal Highlight Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-secondary/50 opacity-50" />

      {/* Massive Typography Background Watermark to fill empty space */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03] mix-blend-overlay">
        <h1 className="text-[15rem] sm:text-[20rem] lg:text-[28rem] font-black font-display tracking-tighter leading-none whitespace-nowrap text-white">
          2026
        </h1>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 h-full">
        
        {/* Left Side: Welcome and Player Details */}
        <div className="flex flex-col text-left gap-4 w-full lg:w-[35%] shrink-0">
          <div className="flex flex-row items-center gap-4">
            {user && (
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative shrink-0 drop-shadow-[0_0_15px_rgba(0,255,135,0.5)]"
              >
                <UserAvatar 
                  avatarId={user.avatar} 
                  className="w-14 h-14 sm:w-20 sm:h-20 text-2xl sm:text-4xl" 
                />
              </motion.div>
            )}

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center justify-start gap-2">
                <span className="font-display text-xs sm:text-sm tracking-[0.2em] text-primary uppercase font-black">
                  Lucky Star FC
                </span>
                <span className="text-white/40 text-[10px] sm:text-xs hidden sm:inline">•</span>
                <span className="font-body text-[9px] sm:text-[10px] uppercase tracking-widest text-outline-variant font-bold bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  Arena Host
                </span>
              </div>
              
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black font-display text-white tracking-wider uppercase mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                Welcome, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user?.name || 'Player'}</span>!
              </h1>
            </div>
          </div>

          {/* Player Stats Dashboard */}
          <div className="grid grid-cols-3 gap-3 w-full mt-1">
            <div className="bg-surface-variant border border-outline-variant/20 rounded-xl p-3 flex flex-col items-center justify-center shadow-inner hover:bg-surface-container-highest transition-colors">
              <span className="font-display text-2xl sm:text-3xl font-black text-primary drop-shadow-md">{totalPoints}</span>
              <span className="text-[9px] sm:text-[10px] font-display uppercase tracking-widest text-outline-variant font-bold mt-1 text-center">Total Pts</span>
            </div>
            <div className="bg-surface-variant border border-outline-variant/20 rounded-xl p-3 flex flex-col items-center justify-center shadow-inner hover:bg-surface-container-highest transition-colors">
              <span className="font-display text-2xl sm:text-3xl font-black text-white drop-shadow-md">{exactWins}</span>
              <span className="text-[9px] sm:text-[10px] font-display uppercase tracking-widest text-outline-variant font-bold mt-1 text-center">Exact Wins</span>
            </div>
            <div className="bg-surface-variant border border-outline-variant/20 rounded-xl p-3 flex flex-col items-center justify-center shadow-inner hover:bg-surface-container-highest transition-colors">
              <span className="font-display text-2xl sm:text-3xl font-black text-secondary drop-shadow-md">{matchesPlayed}</span>
              <span className="text-[9px] sm:text-[10px] font-display uppercase tracking-widest text-outline-variant font-bold mt-1 text-center">Played</span>
            </div>
          </div>
        </div>

        {/* Center: Player Performance (Fills the empty space & fits profile theme) */}
        <div className="flex flex-col items-center justify-center w-full lg:flex-1 lg:px-4 relative z-20">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="w-full max-w-sm bg-gradient-to-b from-primary/20 via-primary/5 to-transparent p-[1px] rounded-2xl shadow-[0_0_30px_rgba(0,255,135,0.15)] group"
          >
            <div className="bg-surface rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center border border-surface-variant h-full">
               <div className="flex items-center gap-2 mb-2 sm:mb-3 bg-surface-variant px-3 py-1.5 rounded-full border border-outline-variant/20">
                 <Icon name="radar" className="text-primary text-sm" />
                 <h3 className="text-white font-display uppercase tracking-widest font-black text-[10px]">Prediction Accuracy</h3>
               </div>
               
               <div className="flex items-end gap-1 sm:gap-2">
                 <p className="text-4xl sm:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-secondary drop-shadow-[0_0_15px_rgba(0,255,135,0.4)]">
                   {matchesPlayed > 0 ? Math.round((exactWins / matchesPlayed) * 100) : 0}<span className="text-2xl sm:text-3xl">%</span>
                 </p>
               </div>
               
               <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-2 sm:my-3" />
               
               <p className="text-[9px] sm:text-[10px] text-outline-variant font-display uppercase tracking-[0.2em] font-bold text-center">
                 Based on {matchesPlayed} Completed <br className="hidden sm:block" /> Matches
               </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: FIFA 2026 Info Card & Live Indicator */}
        <div className="flex flex-row md:flex-row items-center gap-4 sm:gap-6 bg-surface-variant border border-outline-variant/20 rounded-2xl p-4 sm:p-5 w-full lg:w-[35%] justify-between lg:justify-end shrink-0 shadow-inner">
          <div className="flex items-center gap-3">
            <motion.img 
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/1920px-2026_FIFA_World_Cup_emblem.svg.png" 
              alt="World Cup 2026" 
              className="w-12 sm:w-14 h-auto drop-shadow-[0_0_15px_rgba(0,255,135,0.4)]" 
            />
            <div className="flex flex-col text-left">
              <span className="font-display text-lg tracking-widest text-white font-black leading-none">FIFA WORLD CUP</span>
              <span className="text-[9px] font-display text-outline-variant tracking-[0.2em] uppercase font-bold mt-1">USA • CANADA • MEXICO</span>
              <span className="text-[9px] font-body text-primary font-bold tracking-widest uppercase mt-0.5">June 11 - July 19, 2026</span>
            </div>
          </div>
          
          <div className="w-[1px] h-10 bg-white/10 hidden sm:block" />

          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full shadow-inner">
               <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-neon-primary animate-pulse" />
               <span className="text-primary font-display font-black text-[9px] tracking-widest uppercase">Arena Live</span>
            </div>
            <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold hidden sm:inline text-right">Global Match Feed</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
