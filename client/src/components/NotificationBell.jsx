import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Optional: poll every minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-outline-variant hover:text-white rounded-full transition-colors flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-[24px]">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3d00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff3d00] border border-black shadow-[0_0_5px_rgba(255,61,0,0.8)]"></span>
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
              <h3 className="text-white text-[10px] font-display font-bold uppercase tracking-[0.2em]">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] text-primary hover:text-primary-hover uppercase tracking-widest font-display font-bold drop-shadow-[0_0_5px_rgba(0,255,135,0.4)]"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-none">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-outline-variant text-[10px] font-display font-bold uppercase tracking-[0.2em] opacity-50">
                  No notifications
                </div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n._id} 
                    onClick={() => !n.read && handleMarkAsRead(n._id)}
                    className={`p-4 border-b border-white/10 cursor-pointer transition-colors ${n.read ? 'bg-transparent hover:bg-white/5 opacity-70' : 'bg-primary/10 hover:bg-primary/20'}`}
                  >
                    <p className={`text-sm font-body ${n.read ? 'text-outline-variant' : 'text-white font-bold'} mb-2`}>{n.message}</p>
                    <span className="text-[10px] text-primary font-display font-bold uppercase tracking-widest opacity-80">
                      {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
