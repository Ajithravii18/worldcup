import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HeroLanding() {
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
      className="relative w-full rounded-[2rem] overflow-hidden mb-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div className="flex items-center gap-4 sm:gap-6 text-center md:text-left">
        <motion.img 
          whileHover={{ scale: 1.05 }}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/1920px-2026_FIFA_World_Cup_emblem.svg.png" 
          alt="World Cup 2026 Emblem" 
          className="w-12 sm:w-16 h-auto drop-shadow-[0_0_15px_rgba(0,255,135,0.4)]" 
        />
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-widest uppercase drop-shadow-md">
            Lucky Star FC
          </h1>
          <p className="text-xs sm:text-sm font-bold text-outline-variant tracking-[0.2em] uppercase mt-1">
            The Ultimate Prediction Arena
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl shadow-inner">
           <span className="w-2 h-2 rounded-full bg-primary shadow-neon-primary animate-pulse" />
           <span className="text-primary font-display font-black text-xs uppercase tracking-widest">Global Arena Live</span>
        </div>
      </div>
    </motion.div>
  );
}
