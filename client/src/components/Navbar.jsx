import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import ProfileModal from './ProfileModal';
import NotificationBell from './NotificationBell';

export default function Navbar({ view, setView, statusFilter, setStatusFilter }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const onLogoutClick = () => {
    if (confirmLogout) {
      handleLogout();
    } else {
      setConfirmLogout(true);
      setTimeout(() => setConfirmLogout(false), 3000);
    }
  };

  const isMatchesView = view === 'global' || view === 'my';

  const navTabs = [
    { id: 'global',      label: 'Matches' },
    { id: 'my',          label: 'My Preds' },
    { id: 'leaderboard', label: 'Players' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: '#141921', borderBottom: '1px solid #2a3347' }}>

      {/* Top bar */}
      <div className="w-full px-4 h-14 flex items-center justify-between gap-4">

        {/* Branding */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={() => setView && setView('global')}
        >
          <div
            className="w-8 h-8 flex items-center justify-center font-black text-white text-lg font-display"
            style={{ background: '#F26522' }}
          >
            K
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-sm tracking-[0.15em] text-white uppercase">
              Lucky Star FC
            </span>
            <span className="text-[8px] font-bold tracking-[0.3em] uppercase" style={{ color: '#F26522' }}>
              Predictions
            </span>
          </div>
        </div>

        {/* Desktop tab nav */}
        {user && setView && (
          <nav className="hidden md:flex items-center gap-0 h-full">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`px-5 h-14 text-[11px] font-bold uppercase tracking-widest transition-colors duration-150 border-b-2 ${
                  view === tab.id
                    ? 'text-white border-[#F26522]'
                    : 'text-[#6b7280] border-transparent hover:text-white hover:border-white/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="px-5 h-14 text-[11px] font-bold uppercase tracking-widest border-b-2 border-transparent transition-colors"
                style={{ color: '#F26522' }}
              >
                Admin
              </button>
            )}
          </nav>
        )}

        {/* Desktop filter pills — only on matches views */}
        {user && isMatchesView && setStatusFilter && (
          <div className="hidden md:flex items-center gap-0 border" style={{ borderColor: '#2a3347' }}>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-150 ${
                statusFilter === 'upcoming'
                  ? 'text-white'
                  : 'text-[#6b7280] hover:text-white'
              }`}
              style={statusFilter === 'upcoming' ? { background: '#F26522' } : { background: 'transparent' }}
            >
              Open
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-150 ${
                statusFilter === 'completed'
                  ? 'text-white'
                  : 'text-[#6b7280] hover:text-white'
              }`}
              style={statusFilter === 'completed' ? { background: '#F26522' } : { background: 'transparent' }}
            >
              Results
            </button>
          </div>
        )}

        {/* Right side: user controls */}
        {user && (
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <NotificationBell />

            <button
              onClick={() => setProfileOpen(true)}
              className="hover:opacity-80 active:scale-95 transition-all"
              title="Profile"
            >
              <UserAvatar
                avatarId={user.avatar}
                className="w-8 h-8 text-xs border-2"
                style={{ borderColor: '#2a3347' }}
              />
            </button>

            <button
              id="logout-btn"
              onClick={onLogoutClick}
              className="hidden sm:block text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 transition-all duration-150"
              style={confirmLogout
                ? { background: '#ef4444', color: '#fff' }
                : { background: 'transparent', color: '#6b7280', border: '1px solid #2a3347' }
              }
            >
              {confirmLogout ? 'Confirm?' : 'Logout'}
            </button>
          </div>
        )}
      </div>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
}
