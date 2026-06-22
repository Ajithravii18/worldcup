import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { id: 'global',      emoji: '🌍', label: 'MATCHES' },
  { id: 'my',          emoji: '⚽', label: 'MY PREDS' },
  { id: 'leaderboard', emoji: '🏆', label: 'PLAYERS' },
];

export default function BottomNav({ view, setView, statusFilter, setStatusFilter }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMatchesView = view === 'global' || view === 'my';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-bottom" style={{ background: 'rgba(5, 20, 36, 0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>

      {/* Secondary filter bar — shown only in match views */}
      {isMatchesView && (
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setStatusFilter('upcoming')}
            className="flex-1 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors duration-150 border-b-2"
            style={statusFilter === 'upcoming'
              ? { color: '#ec6a06', borderColor: '#ec6a06' }
              : { color: '#bccbb9', borderColor: 'transparent' }
            }
          >
            Predict / Open
          </button>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <button
            onClick={() => setStatusFilter('completed')}
            className="flex-1 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors duration-150 border-b-2"
            style={statusFilter === 'completed'
              ? { color: '#ec6a06', borderColor: '#ec6a06' }
              : { color: '#bccbb9', borderColor: 'transparent' }
            }
          >
            🏆 Results
          </button>
        </div>
      )}

      {/* Main tab bar */}
      <div className="flex">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className="flex-1 flex flex-col items-center justify-center pt-2.5 pb-3 gap-0.5 transition-colors duration-150"
            style={view === tab.id
              ? { color: '#ec6a06' }
              : { color: '#bccbb9' }
            }
          >
            <span className="text-lg leading-tight drop-shadow-sm">{tab.emoji}</span>
            <span className="text-[8px] font-mono font-black tracking-widest leading-normal">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
