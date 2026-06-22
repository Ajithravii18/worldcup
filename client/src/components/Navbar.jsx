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
    <header className="fixed top-0 w-full z-50 glass-panel-heavy border-b-0 shadow-lg transition-all duration-200">
      {/* Decorative top green line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
      
      <div className="flex items-center justify-between px-4 md:px-8 h-16 w-full max-w-7xl mx-auto">
        
        {/* Branding */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
          onClick={() => setView && setView('global')}
        >
          <div className="w-8 h-8 rounded bg-primary text-background flex items-center justify-center font-display-lg text-2xl font-bold shadow-neon-primary group-hover:scale-105 transition-transform">
            LS
          </div>
          <h1 className="font-display-lg text-2xl font-bold uppercase tracking-wide text-on-surface group-hover:text-primary transition-colors">
            LUCKY STAR <span className="text-primary">FC</span>
          </h1>
        </div>

        {/* Desktop tab nav */}
        {user && setView && (
          <nav className="hidden md:flex items-center gap-2 h-full ml-12">
            {navTabs.map((tab) => {
              const isActive = view === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={`px-5 h-10 rounded-md font-label-md text-base uppercase tracking-widest transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/30 shadow-[inset_0_0_10px_rgba(0,255,135,0.1)]'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="px-5 h-10 rounded-md font-label-md text-base uppercase tracking-widest text-secondary border border-transparent hover:bg-white/5 transition-all flex items-center justify-center ml-2"
              >
                Admin
              </button>
            )}
          </nav>
        )}

        {/* Right side: user controls */}
        {user && (
          <div className="flex items-center gap-4 ml-auto">
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="md:hidden flex items-center justify-center p-2 text-secondary hover:bg-white/10 transition-colors rounded-full"
                title="Admin Dashboard"
              >
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </button>
            )}

            <div className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              <NotificationBell />
            </div>

            <button
              onClick={() => setProfileOpen(true)}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-outline-variant hover:border-primary transition-colors focus:outline-none focus:border-primary shadow-sm"
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
              className="flex items-center justify-center h-9 px-3 rounded-md transition-all duration-150 text-on-surface-variant hover:text-error hover:bg-error/10 border border-transparent hover:border-error/30"
              title="Logout"
            >
              <span className="hidden sm:block font-label-md text-base uppercase tracking-wider mt-0.5">
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
