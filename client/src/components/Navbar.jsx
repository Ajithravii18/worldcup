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
              className="flex items-center justify-center h-8 px-2 sm:px-3 rounded transition-all duration-150 hover:bg-red-50 text-slate-500 hover:text-red-600 sm:border sm:border-slate-200"
              title="Logout"
            >
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest">
                Logout
              </span>
              <span className="sm:hidden flex items-center justify-center text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 1 12.728 0M12 3v9" />
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
