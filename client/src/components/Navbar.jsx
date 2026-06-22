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
    <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop h-16 w-full max-w-container-max mx-auto">
        
        {/* Branding */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={() => setView && setView('global')}
        >
          <h1 className="font-headline-md text-headline-md font-bold uppercase tracking-tighter text-primary">
            LUCKY STAR FC
          </h1>
        </div>

        {/* Desktop tab nav */}
        {user && setView && (
          <nav className="hidden md:flex items-center gap-0 h-full ml-8">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`px-5 h-16 font-label-sm text-label-sm uppercase tracking-wider transition-colors duration-150 border-b-2 ${
                  view === tab.id
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                {tab.label}
              </button>
            ))}
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="px-5 h-16 font-label-sm text-label-sm uppercase tracking-wider border-b-2 border-transparent transition-colors text-secondary hover:bg-surface-container-low"
              >
                Admin
              </button>
            )}
          </nav>
        )}

        {/* Right side: user controls */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="md:hidden flex items-center justify-center p-2 text-secondary hover:bg-surface-container-low transition-colors rounded-full active:opacity-80"
                title="Admin Dashboard"
              >
                <span className="material-symbols-outlined text-sm">settings</span>
              </button>
            )}

            <div className="text-on-surface-variant hover:text-primary transition-colors">
              <NotificationBell />
            </div>

            <button
              onClick={() => setProfileOpen(true)}
              className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
              title="Profile"
            >
              <UserAvatar
                avatarId={user.avatar}
                className="w-full h-full object-cover"
              />
            </button>

            <button
              id="logout-btn"
              onClick={onLogoutClick}
              className="flex items-center justify-center h-8 px-2 sm:px-3 rounded transition-all duration-150 text-on-surface-variant hover:text-error hover:bg-error-container/30 border border-transparent hover:border-error-container"
              title="Logout"
            >
              <span className="hidden sm:block font-label-sm text-label-sm uppercase tracking-wider">
                Logout
              </span>
              <span className="sm:hidden flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </span>
            </button>
          </div>
        )}
      </div>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
}
