import { useState, useEffect, useRef } from 'react';
import HeroLanding from './HeroLanding';
import WinnerBanner from './WinnerBanner';
import { motion } from 'framer-motion';

export default function HeroCarousel({ matches, globalPredictions, currentTime, onMatchClick }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const index = Math.round(scrollLeft / width);
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const width = scrollRef.current.clientWidth;
        let nextIndex = activeIndex + 1;
        if (nextIndex >= 2) nextIndex = 0;
        
        scrollRef.current.scrollTo({
          left: nextIndex * width,
          behavior: 'smooth'
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-8 w-full group"
    >
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full pb-2 items-stretch"
      >
        <div className="min-w-full flex-shrink-0 snap-center px-1">
          <HeroLanding predictions={globalPredictions} />
        </div>
        <div className="min-w-full flex-shrink-0 snap-center px-1">
          <WinnerBanner 
            matches={matches} 
            predictions={globalPredictions} 
            currentTime={currentTime} 
            onClick={onMatchClick} 
          />
        </div>
      </div>
      
      <div className="flex justify-center gap-3 mt-4">
        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === 0 ? 'bg-primary shadow-neon-primary scale-125' : 'bg-white/20 hover:bg-white/40'}`} />
        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === 1 ? 'bg-primary shadow-neon-primary scale-125' : 'bg-white/20 hover:bg-white/40'}`} />
      </div>
    </motion.div>
  );
}
