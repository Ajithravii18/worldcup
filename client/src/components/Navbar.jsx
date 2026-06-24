import { useState } from 'react';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import NotificationBell from './NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ view, setView, statusFilter, setStatusFilter, onProfileClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const onLogoutClick = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      handleLogout();
    }
  };

  const navTabs = [
    { id: 'global',      label: 'Matches' },
    { id: 'my',          label: 'My Preds' },
    { id: 'leaderboard', label: 'Players' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 w-full z-50 bg-surface border-b border-surface-variant shadow-lg"
    >
      <div className="flex items-center justify-between px-4 md:px-8 h-20 w-full max-w-[1600px] mx-auto">
        
        {/* Branding */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => setView && setView('global')}
        >
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-display text-2xl font-black shadow-neon-primary">
            <Icon name="sports_soccer" className="text-2xl" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-black uppercase tracking-widest text-white">
            Lucky Star <span className="text-primary">FC</span>
          </h1>
        </motion.div>

        {/* Desktop tab nav */}
        {user && setView && (
          <nav className="hidden md:flex items-center gap-2 h-full ml-12">
            {navTabs.map((tab) => {
              const isActive = view === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setView(tab.id);
                  }}
                  className={`relative px-6 h-12 rounded-xl font-display text-lg uppercase tracking-widest transition-colors flex items-center justify-center z-10 ${
                    isActive ? 'text-white font-black' : 'text-outline-variant hover:text-white font-bold'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-tab"
                      className="absolute inset-0 bg-primary rounded-xl shadow-neon-primary -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="px-6 h-12 rounded-xl font-display text-lg uppercase tracking-widest text-white border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center ml-4 font-bold"
              >
                Admin
              </button>
            )}
          </nav>
        )}

        {/* Right side: user controls */}
        {user && (
          <div className="flex items-center gap-4 sm:gap-5 ml-auto">
            {/* Desktop Admin */}
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="hidden md:flex items-center justify-center p-2 text-outline-variant hover:text-white transition-colors"
                title="Admin Dashboard"
              >
                <Icon name="settings" className="text-[24px]" />
              </button>
            )}

            {/* Notification Bell (Always Visible) */}
            <div className="text-outline-variant hover:text-primary transition-colors cursor-pointer">
              <NotificationBell />
            </div>

            {/* Desktop Profile & Logout */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onProfileClick}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-primary transition-colors shadow-lg"
                title="Profile"
              >
                <UserAvatar
                  avatarId={user.avatar}
                  className="w-full h-full object-cover"
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogoutClick}
                className="flex items-center justify-center h-10 px-5 rounded-xl transition-all duration-150 text-error border border-error/50 hover:bg-error/20 font-bold uppercase tracking-widest text-xs"
                title="Logout"
              >
                Logout
              </motion.button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center text-white hover:text-primary transition-colors"
            >
              <Icon name="menu" className="text-[32px]" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/90 z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-dvh w-64 bg-[#0a0f18] border-l border-white/10 shadow-2xl z-[70] md:hidden flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-display text-lg font-black uppercase tracking-widest text-white">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <Icon name="close" className="text-[28px]" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <button
                  onClick={() => { setMobileMenuOpen(false); onProfileClick(); }}
                  className="flex items-center gap-4 text-white hover:text-primary transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                    <UserAvatar avatarId={user?.avatar} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-display font-bold tracking-widest uppercase">My Profile</span>
                </button>

                {user?.role === 'admin' && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/admin'); }}
                    className="flex items-center gap-4 text-white hover:text-primary transition-colors text-left"
                  >
                    <Icon name="settings" className="text-[24px]" />
                    <span className="font-display font-bold tracking-widest uppercase">Admin Board</span>
                  </button>
                )}

                <div className="w-full h-[1px] bg-white/10 my-4" />

                <button
                  onClick={() => { setMobileMenuOpen(false); onLogoutClick(); }}
                  className="flex items-center gap-4 text-error hover:text-red-400 transition-colors text-left"
                >
                  <Icon name="logout" className="text-[24px]" />
                  <span className="font-display font-bold tracking-widest uppercase">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
