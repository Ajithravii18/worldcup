import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function Footer() {
  return (
    <footer className="w-full mt-auto pt-10 pb-28 md:py-16 bg-black/40 backdrop-blur-xl border-t border-white/10 relative z-10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Branding */}
        <div className="flex items-center gap-4">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/1920px-2026_FIFA_World_Cup_emblem.svg.png" 
            alt="World Cup 2026 Emblem" 
            className="w-10 h-auto drop-shadow-md" 
          />
          <div className="flex flex-col">
            <h2 className="font-display text-xl font-black text-white tracking-widest uppercase">Lucky Star FC</h2>
            <p className="text-xs text-outline-variant font-bold tracking-[0.2em] uppercase">World Cup 2026</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs font-display font-bold uppercase tracking-widest text-outline-variant">
          <a href="#" className="hover:text-primary transition-colors">Rules</a>
          <a href="#" className="hover:text-primary transition-colors">Leaderboard</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>

        {/* Social / Copyright */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-3">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-outline-variant hover:text-white hover:bg-primary/20 hover:border-primary/50 border border-white/10 transition-colors">
              <Icon name="language" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-outline-variant hover:text-white hover:bg-primary/20 hover:border-primary/50 border border-white/10 transition-colors">
              <Icon name="share" />
            </a>
          </div>
          <p className="text-[10px] text-outline-variant/50 tracking-widest uppercase">
            © 2026 Lucky Star FC. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
