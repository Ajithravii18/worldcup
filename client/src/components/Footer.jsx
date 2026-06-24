import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function Footer() {
  return (
    <footer className="w-full mt-auto pt-10 pb-28 md:py-16 bg-black/40 backdrop-blur-xl border-t border-white/10 relative z-10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Branding */}
        <div className="flex items-center justify-center w-full gap-4">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/1920px-2026_FIFA_World_Cup_emblem.svg.png" 
            alt="World Cup 2026 Emblem" 
            className="w-10 h-auto drop-shadow-md" 
          />
          <div className="flex flex-col text-left">
            <h2 className="font-display text-xl font-black text-white tracking-widest uppercase">Lucky Star FC</h2>
            <p className="text-xs text-outline-variant font-bold tracking-[0.2em] uppercase">World Cup 2026</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
