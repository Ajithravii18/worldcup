import Icon from './Icon';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import NotificationBell from './NotificationBell';
import { motion } from 'framer-motion';

export default function Navbar({ view, setView, statusFilter, setStatusFilter, onProfileClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
      className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-2xl"
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
                  onClick={() => setView(tab.id)}
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
          <div className="flex items-center gap-5 ml-auto">
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="md:hidden flex items-center justify-center p-2 text-outline-variant hover:text-white transition-colors"
                title="Admin Dashboard"
              >
                <Icon name="settings" className="text-[24px]" />
              </button>
            )}

            <div className="text-outline-variant hover:text-primary transition-colors cursor-pointer">
              <NotificationBell />
            </div>

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
              id="logout-btn"
              onClick={onLogoutClick}
              className="hidden sm:flex items-center justify-center h-10 px-5 rounded-xl transition-all duration-150 text-error border border-error/50 hover:bg-error/20 font-bold uppercase tracking-widest text-xs"
              title="Logout"
            >
              Logout
            </motion.button>
            <button
              onClick={onLogoutClick}
              className="sm:hidden text-error hover:text-red-400 p-2"
            >
              <Icon name="logout" className="text-[24px]" />
            </button>
          </div>
        )}
      </div>
    </motion.header>
  );
}
