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

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Backdrop blur bar */}
      <div className="w-full px-4 py-3 flex items-center justify-between shadow-sm bg-white border-b border-gray-200">
        {/* Premium Branding */}
        <div className="flex items-center gap-3 ml-1 group cursor-pointer" onClick={() => setView && setView('global')}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-theme-primary to-theme-secondary flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
            <span className="text-white font-black text-xl sm:text-2xl leading-none font-display italic pr-0.5">K</span>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-xl sm:text-2xl leading-none tracking-[0.2em] font-black text-gray-900 group-hover:text-theme-primary transition-colors duration-300">
              LUCKY STAR FC
            </h1>
            <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5">
              <div className="h-[1px] w-4 bg-theme-primary"></div>
              <p className="text-[8px] sm:text-[9px] text-gray-500 tracking-[0.4em] font-bold uppercase leading-none">
                PREDICTIONS
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation (Hidden on Mobile) */}
        {user && setView && (
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1 border border-gray-200 shadow-sm">
              <button
                onClick={() => setView('global')}
                className={`px-5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  view === 'global' ? 'bg-white text-theme-primary shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Global
              </button>
              <button
                onClick={() => setView('my')}
                className={`px-5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  view === 'my' ? 'bg-white text-theme-primary shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                My Preds
              </button>
              <button
                onClick={() => setView('leaderboard')}
                className={`px-5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  view === 'leaderboard' ? 'bg-white text-theme-primary shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Leaderboard
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 text-purple-600 hover:bg-purple-50"
                >
                  Admin
                </button>
              )}
            </nav>

            {/* Filter Toggle if applicable */}
            {isMatchesView && setStatusFilter && (
              <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
                <button
                  onClick={() => setStatusFilter('upcoming')}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    statusFilter === 'upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    statusFilter === 'completed' 
                      ? 'bg-white text-theme-primary shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🏆 RESULTS
                </button>
              </div>
            )}
          </div>
        )}

        {/* User info + logout */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end justify-center">
              <span className="text-sm font-black text-gray-900 tracking-widest uppercase leading-none">{user.name}</span>
              <span className="text-[10px] text-gray-500 font-bold tracking-widest mt-1 leading-none">{user.email}</span>
            </div>
            
            {/* Premium Profile Icon & Controls */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full p-1.5 pl-2 pr-3 shadow-sm">
              <NotificationBell />
              
              <div className="w-[1px] h-6 bg-gray-300 mx-1 hidden sm:block"></div>
              
              <button 
                onClick={() => setProfileOpen(true)}
                className="relative group hover:scale-105 active:scale-95 transition-all duration-300"
                title="Edit Profile"
                aria-label="Edit Profile"
              >
                <UserAvatar 
                  avatarId={user.avatar} 
                  className="w-8 h-8 sm:w-9 sm:h-9 text-xs border border-gray-300 rounded-full group-hover:border-theme-primary relative z-10 bg-white" 
                />
              </button>
              
              <div className="w-[1px] h-6 bg-gray-300 mx-1"></div>
              
              <button
                id="logout-btn"
                onClick={onLogoutClick}
                className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1.5 rounded-full transition-all duration-300 ${
                  confirmLogout 
                    ? 'text-white bg-red-500 shadow-sm scale-105' 
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                {confirmLogout ? 'CONFIRM?' : 'LOGOUT'}
              </button>
            </div>
          </div>
        )}
      </div>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
}
