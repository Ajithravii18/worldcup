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
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface-container-lowest border-t border-outline-variant shadow-lg">

      {/* Secondary filter bar — shown only in match views */}
      {isMatchesView && (
        <div className="flex border-b border-surface-container-high bg-surface">
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`flex-1 py-2 font-label-sm text-label-sm uppercase tracking-wider transition-colors duration-150 border-b-2 ${
              statusFilter === 'upcoming'
                ? 'text-primary border-primary'
                : 'text-on-surface-variant border-transparent'
            }`}
          >
            Predict / Open
          </button>
          <div className="w-[1px] bg-surface-container-high my-1" />
          <button
            onClick={() => setStatusFilter('completed')}
            className={`flex-1 py-2 font-label-sm text-label-sm uppercase tracking-wider transition-colors duration-150 border-b-2 ${
              statusFilter === 'completed'
                ? 'text-primary border-primary'
                : 'text-on-surface-variant border-transparent'
            }`}
          >
            Results
          </button>
        </div>
      )}

      {/* Main tab bar */}
      <div className="flex justify-around items-center h-20 px-2 pb-safe">
        {tabs.map((tab, i) => {
          const isActive = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-150 ${
                isActive 
                  ? 'w-20 h-14 bg-secondary-container text-on-secondary-container rounded-full px-4 py-1' 
                  : 'w-16 h-12 text-on-surface-variant hover:text-primary'
              }`}
            >
              <span 
                className="material-symbols-outlined text-[24px] mb-1" 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className={`font-label-sm text-[10px] uppercase tracking-wider ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
