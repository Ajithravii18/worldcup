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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-bottom" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>

      {/* Secondary filter bar — shown only in match views */}
      {isMatchesView && (
        <div className="flex border-b" style={{ borderColor: '#e2e8f0' }}>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors duration-150 border-b-2"
            style={statusFilter === 'upcoming'
              ? { color: '#F26522', borderColor: '#F26522' }
              : { color: '#64748b', borderColor: 'transparent' }
            }
          >
            Predict / Open
          </button>
          <div style={{ width: '1px', background: '#e2e8f0' }} />
          <button
            onClick={() => setStatusFilter('completed')}
            className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors duration-150 border-b-2"
            style={statusFilter === 'completed'
              ? { color: '#F26522', borderColor: '#F26522' }
              : { color: '#64748b', borderColor: 'transparent' }
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
              ? { color: '#F26522' }
              : { color: '#64748b' }
            }
          >
            <span className="text-lg leading-tight">{tab.emoji}</span>
            <span className="text-[8px] font-black tracking-widest leading-normal">{tab.label}</span>
          </button>
        ))}
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="flex-1 flex flex-col items-center justify-center pt-2.5 pb-3 gap-0.5 transition-colors duration-150"
            style={{ color: '#64748b' }}
          >
            <span className="text-lg leading-tight">⚙️</span>
            <span className="text-[8px] font-black tracking-widest leading-normal">ADMIN</span>
          </button>
        )}
      </div>
    </div>
  );
}
