import React from 'react';

const tabs = [
  { id: 'global',      emoji: '🌍', label: 'MATCHES' },
  { id: 'my',          emoji: '⚽', label: 'MY PREDS' },
  { id: 'leaderboard', emoji: '🏆', label: 'PLAYERS' },
];

export default function BottomNav({ view, setView, statusFilter, setStatusFilter }) {
  const isMatchesView = view === 'global' || view === 'my';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40" style={{ background: '#141921', borderTop: '1px solid #2a3347' }}>

      {/* Secondary filter bar — shown only in match views */}
      {isMatchesView && (
        <div className="flex border-b" style={{ borderColor: '#2a3347' }}>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-150 border-b-2"
            style={statusFilter === 'upcoming'
              ? { color: '#F26522', borderColor: '#F26522' }
              : { color: '#6b7280', borderColor: 'transparent' }
            }
          >
            Predict / Open
          </button>
          <div style={{ width: '1px', background: '#2a3347' }} />
          <button
            onClick={() => setStatusFilter('completed')}
            className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-150 border-b-2"
            style={statusFilter === 'completed'
              ? { color: '#F26522', borderColor: '#F26522' }
              : { color: '#6b7280', borderColor: 'transparent' }
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
            className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors duration-150 border-t-2"
            style={view === tab.id
              ? { color: '#F26522', borderColor: '#F26522' }
              : { color: '#6b7280', borderColor: 'transparent' }
            }
          >
            <span className="text-lg leading-none">{tab.emoji}</span>
            <span className="text-[8px] font-black tracking-widest leading-none">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
