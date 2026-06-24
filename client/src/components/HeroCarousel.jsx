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

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth'
      });
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
    }, 6000); // Slightly longer for better readability
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-12 w-full group"
    >
      {/* Ambient background glow for Pro Max feel */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

      <div className="relative rounded-[2.5rem] bg-[#0A0A0A]/40 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden p-1 md:p-2">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full items-stretch relative z-10"
        >
          <div className="min-w-full flex-shrink-0 snap-center p-1 md:p-2">
            <HeroLanding predictions={globalPredictions} />
          </div>
          <div className="min-w-full flex-shrink-0 snap-center p-1 md:p-2">
            <WinnerBanner 
              matches={matches} 
              predictions={globalPredictions} 
              currentTime={currentTime} 
              onClick={onMatchClick} 
            />
          </div>
        </div>

        {/* Hover Navigation Arrows (Glassmorphism) */}
        <div className="absolute inset-y-0 left-2 md:left-4 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
          <button 
            onClick={() => scrollToIndex(activeIndex === 0 ? 1 : 0)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.8)]"
            aria-label="Previous Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="absolute inset-y-0 right-2 md:right-4 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
          <button 
            onClick={() => scrollToIndex(activeIndex === 0 ? 1 : 0)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.8)]"
            aria-label="Next Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Pro Max Indicator Dots (Pill shape for active) */}
      <div className="flex justify-center items-center gap-2 mt-2 md:mt-4">
        {[0, 1].map((index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ease-out cursor-pointer ${
              activeIndex === index 
                ? 'w-8 bg-primary shadow-[0_0_12px_rgba(0,255,135,0.8)] opacity-100' 
                : 'w-2 bg-white/20 hover:bg-white/40 hover:w-3 opacity-60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
