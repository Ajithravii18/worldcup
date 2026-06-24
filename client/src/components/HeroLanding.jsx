import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
import Icon from './Icon';

export default function HeroLanding() {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Welcome and Player Details */}
        <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-5 w-full lg:w-auto">
          {user && (
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="relative p-1 rounded-2xl bg-gradient-to-tr from-primary via-white/10 to-secondary shadow-neon-primary"
            >
              <div className="bg-black/80 p-2.5 rounded-xl backdrop-blur-2xl">
                <UserAvatar 
                  avatarId={user.avatar} 
                  className="w-12 h-12 sm:w-16 sm:h-16 text-2xl" 
                />
              </div>
            </motion.div>
          )}

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-display text-sm tracking-[0.2em] text-primary uppercase font-black">
                Lucky Star FC
              </span>
              <span className="text-white/40 text-xs hidden sm:inline">•</span>
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-widest text-outline-variant font-bold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                Arena Host
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-white tracking-wider uppercase mt-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Welcome back, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user?.name || 'Player'}</span>!
            </h1>
            
            <p className="text-xs sm:text-sm text-outline-variant font-medium mt-2 max-w-md leading-relaxed">
              Analyze the field, lock in your predictions, and climb the global leaderboard to claim ultimate bragging rights.
            </p>
          </div>
        </div>

        {/* Right Side: FIFA 2026 Info Card & Live Indicator */}
        <div className="flex flex-row md:flex-row items-center gap-4 sm:gap-6 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl w-full lg:w-auto justify-between lg:justify-start shrink-0 shadow-inner">
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
            <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold hidden sm:inline">Global Match Feed</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
