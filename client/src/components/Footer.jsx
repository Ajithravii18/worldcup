import { motion } from 'framer-motion';
import Icon from './Icon';

export default function Footer({ setView }) {
  const handleNavClick = (tabId) => {
    if (setView) {
      setView(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full mt-auto pt-16 pb-28 md:pb-16 bg-gradient-to-t from-black via-black/95 to-transparent border-t border-white/10 relative z-10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & About */}
          <div className="flex flex-col text-left gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-display text-xl font-black shadow-neon-primary">
                <Icon name="sports_soccer" className="text-xl" />
              </div>
              <h2 className="font-display text-2xl font-black text-white tracking-widest uppercase">
                Lucky Star <span className="text-primary">FC</span>
              </h2>
            </div>
            
            <p className="text-xs text-outline-variant leading-relaxed max-w-xs font-medium">
              The ultimate prediction arena for the FIFA World Cup 2026. Follow live results, predict match scores, earn points, and climb the ranks against friends and global players.
            </p>

            {/* Social Icons (Mocked) */}
            <div className="flex items-center gap-3 mt-2">
              {['facebook', 'alternate_email', 'language', 'help'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ade80' }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-outline-variant hover:text-white transition-colors"
                >
                  <Icon name={social} className="text-[16px]" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col text-left">
            <h3 className="font-display text-sm tracking-[0.25em] text-white uppercase font-black mb-4 border-l-2 border-primary pl-3">
              Arena Navigation
            </h3>
            <ul className="space-y-3 text-xs font-medium">
              {[
                { id: 'global', label: 'Match Feed & Odds' },
                { id: 'my', label: 'My Predictions' },
                { id: 'leaderboard', label: 'Player Standings' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className="text-outline-variant hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Icon name="arrow_right" className="text-[12px] text-primary" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Tournament Details */}
          <div className="flex flex-col text-left">
            <h3 className="font-display text-sm tracking-[0.25em] text-white uppercase font-black mb-4 border-l-2 border-primary pl-3">
              Tournament Info
            </h3>
            <ul className="space-y-2.5 text-xs text-outline-variant font-medium">
              <li className="flex items-center gap-2">
                <Icon name="public" className="text-[14px] text-primary" />
                <span>Hosts: USA, Canada, Mexico</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="location_on" className="text-[14px] text-primary" />
                <span>16 Host Stadiums</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="event" className="text-[14px] text-primary" />
                <span>June 11 – July 19, 2026</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="sports" className="text-[14px] text-primary" />
                <span>104 Matches total</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Compete & Help */}
          <div className="flex flex-col text-left gap-4">
            <h3 className="font-display text-sm tracking-[0.25em] text-white uppercase font-black mb-1 border-l-2 border-primary pl-3">
              Join the Arena
            </h3>
            <p className="text-xs text-outline-variant leading-relaxed font-medium">
              Analyze live team stats, make correct-score selections, and earn glory points. Need assistance or want to suggest new features?
            </p>
            <motion.a
              href="mailto:support@luckystarfc.com"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2.5 bg-white/5 hover:bg-primary/20 hover:border-primary/30 border border-white/10 text-white hover:text-primary transition-all rounded-xl text-center text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-inner"
            >
              <Icon name="mail" className="text-[14px]" />
              Contact Support
            </motion.a>
          </div>

        </div>

        {/* Separator line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

        {/* Bottom Row: Copyright and Legal Disclaimer */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
          <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} Lucky Star FC. All rights reserved.
          </div>
          <div className="text-[9px] text-outline-variant/60 max-w-2xl leading-relaxed italic">
            Disclaimer: This platform is a non-commercial fan-made prediction game created for entertainment purposes. All team names, brand logos, and tournament trademarks remain the property of FIFA and their respective owners.
          </div>
        </div>

      </div>
    </footer>
  );
}
