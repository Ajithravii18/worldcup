import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'global',      icon: 'public', label: 'Matches' },
  { id: 'my',          icon: 'analytics', label: 'My Preds' },
  { id: 'leaderboard', icon: 'groups', label: 'Players' },
];

export default function BottomNav({ view, setView, statusFilter, setStatusFilter }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMatchesView = view === 'global';

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="md:hidden fixed bottom-0 w-full z-50 bg-black/60 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
    >

      {/* Secondary filter bar — shown only in match views */}
      {isMatchesView && (
        <div className="flex bg-black/40 border-b border-white/5">
          <button
            onClick={() => {
              setStatusFilter('upcoming');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 py-3 font-display text-sm uppercase tracking-widest transition-colors duration-150 border-b-2 relative ${
              statusFilter === 'upcoming'
                ? 'text-primary border-primary bg-primary/5 font-black'
                : 'text-outline-variant border-transparent hover:bg-white/5 font-bold'
            }`}
          >
            Open Matches
          </button>
          <div className="w-[1px] bg-white/10 my-2" />
          <button
            onClick={() => {
              setStatusFilter('completed');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 py-3 font-display text-sm uppercase tracking-widest transition-colors duration-150 border-b-2 relative ${
              statusFilter === 'completed'
                ? 'text-primary border-primary bg-primary/5 font-black'
                : 'text-outline-variant border-transparent hover:bg-white/5 font-bold'
            }`}
          >
            Results
          </button>
        </div>
      )}

      {/* Main tab bar */}
      <div className="flex justify-around items-center h-20 px-2 pb-safe relative">
        {tabs.map((tab) => {
          const isActive = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setView(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-200 relative w-24 h-16 z-10 ${
                isActive ? 'text-white' : 'text-outline-variant hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-active-tab"
                  className="absolute inset-0 bg-primary rounded-2xl shadow-neon-primary -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon name={tab.icon} className={`mb-1 relative z-10 transition-all ${isActive ? 'text-[28px]' : 'text-[24px]'}`} />
              <span className={`font-display uppercase tracking-wider relative z-10 transition-all ${isActive ? 'text-sm font-black' : 'text-xs font-bold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
