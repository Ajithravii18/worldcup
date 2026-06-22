import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { id: 'global',      icon: 'public', label: 'Matches' },
  { id: 'my',          icon: 'analytics', label: 'My Preds' },
  { id: 'leaderboard', icon: 'groups', label: 'Players' },
];

export default function BottomNav({ view, setView, statusFilter, setStatusFilter }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMatchesView = view === 'global' || view === 'my';

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 glass-panel-heavy shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">

      {/* Secondary filter bar — shown only in match views */}
      {isMatchesView && (
        <div className="flex bg-surface-container-lowest/50 border-b border-outline-variant/30">
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`flex-1 py-3 font-label-md text-sm uppercase tracking-wider transition-colors duration-150 border-b-2 relative ${
              statusFilter === 'upcoming'
                ? 'text-primary border-primary bg-primary/5'
                : 'text-on-surface-variant border-transparent hover:bg-white/5'
            }`}
          >
            Open Matches
            {statusFilter === 'upcoming' && <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20"></div>}
          </button>
          <div className="w-[1px] bg-outline-variant/30 my-2" />
          <button
            onClick={() => setStatusFilter('completed')}
            className={`flex-1 py-3 font-label-md text-sm uppercase tracking-wider transition-colors duration-150 border-b-2 relative ${
              statusFilter === 'completed'
                ? 'text-primary border-primary bg-primary/5'
                : 'text-on-surface-variant border-transparent hover:bg-white/5'
            }`}
          >
            Results
            {statusFilter === 'completed' && <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20"></div>}
          </button>
        </div>
      )}

      {/* Main tab bar */}
      <div className="flex justify-around items-center h-20 px-2 pb-safe relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-outline-variant to-transparent opacity-30" />
        {tabs.map((tab, i) => {
          const isActive = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-200 relative ${
                isActive 
                  ? 'w-24 h-16 text-primary' 
                  : 'w-20 h-14 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20 shadow-[inset_0_0_12px_rgba(0,255,135,0.1)]"></div>
              )}
              <span 
                className={`material-symbols-outlined mb-1 relative z-10 transition-all ${isActive ? 'text-[28px] drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]' : 'text-[24px]'}`} 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className={`font-label-md uppercase tracking-wider relative z-10 transition-all ${isActive ? 'text-xs' : 'text-[10px]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
