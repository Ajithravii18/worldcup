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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const onLogoutClick = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      handleLogout();
    }
  };

  const isMatchesView = view === 'global' || view === 'my';

  const navTabs = [
    { id: 'global',      label: 'Matches' },
    { id: 'my',          label: 'My Preds' },
    { id: 'leaderboard', label: 'Players' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>

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
            <span className="font-display font-black text-sm tracking-[0.15em] text-slate-900 uppercase">
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
                    ? 'text-slate-900 border-[#F26522]'
                    : 'text-[#64748b] border-transparent hover:text-slate-900 hover:border-slate-900/30'
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

        {/* Desktop filter pills removed and moved to HomePage */}

        {/* Right side: user controls */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3 ml-auto md:ml-0">
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-theme-primary/10 text-theme-primary transition-colors"
                title="Admin Dashboard"
              >
                ⚙️
              </button>
            )}

            <NotificationBell />

            <button
              onClick={() => setProfileOpen(true)}
              className="hover:opacity-80 active:scale-95 transition-all"
              title="Profile"
            >
              <UserAvatar
                avatarId={user.avatar}
                className="w-8 h-8 text-xs border-2"
                style={{ borderColor: '#e2e8f0' }}
              />
            </button>

            <button
              id="logout-btn"
              onClick={onLogoutClick}
              className="flex items-center justify-center h-8 px-2 sm:px-3 rounded transition-all duration-150 text-slate-400 hover:text-red-500 sm:border sm:border-slate-200"
              title="Logout"
            >
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest">
                Logout
              </span>
              <span className="sm:hidden flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
}
