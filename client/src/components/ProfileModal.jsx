import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import UserAvatar, { AVATARS } from './UserAvatar';
import api from '../api/axios';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUserProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'br_dribbler');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [pwSection, setPwSection] = useState(false);
  const [pwStep, setPwStep] = useState('idle');
  const [newPassword, setNewPassword] = useState('');
  const [pwOtp, setPwOtp] = useState(['', '', '', '', '', '']);
  const pwOtpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwCooldown, setPwCooldown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setName(user?.name || '');
      setSelectedAvatar(user?.avatar || 'br_dribbler');
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) {
      setError('Display name is required');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put('/users/profile', {
        name: name.trim(),
        avatar: selectedAvatar,
      });

      updateUserProfile(res.data);
      setSuccess(true);
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#00ff87', '#ffd700', '#ff3d00']
      });

      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPwSection(false);
      setPwStep('idle');
      setPwOtp(['','','','','','']);
      setNewPassword('');
      setPwError('');
    }, 300);
  };

  const handleSendPwOtp = async () => {
    setPwError('');
    if (!newPassword || newPassword.length < 6) return setPwError('Password must be at least 6 characters');
    setPwLoading(true);
    try {
      await api.post('/auth/change-password/send-otp');
      setPwStep('sent');
      startPwCooldown();
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleVerifyPwOtp = async (e) => {
    e.preventDefault();
    setPwError('');
    const code = pwOtp.join('');
    if (code.length < 6) return setPwError('Enter the full 6-digit code');
    setPwLoading(true);
    try {
      await api.post('/auth/change-password/verify-otp', { otp: code, newPassword });
      setPwStep('done');
      setPwOtp(['','','','','','']);
      setNewPassword('');
    } catch (err) {
      setPwError(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setPwLoading(false);
    }
  };

  const startPwCooldown = () => {
    setPwCooldown(60);
    const iv = setInterval(() => setPwCooldown(c => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; }), 1000);
  };

  const handlePwOtpInput = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const n = [...pwOtp]; n[i] = val.slice(-1); setPwOtp(n);
    if (val && i < 5) pwOtpRefs[i + 1].current?.focus();
  };

  const handlePwOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !pwOtp[i] && i > 0) pwOtpRefs[i - 1].current?.focus();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-none rounded-3xl p-6 sm:p-8 relative bg-black/80 backdrop-blur-2xl shadow-2xl border border-white/20"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 shadow-neon-primary"></div>

            <button
              onClick={handleClose}
              className="absolute right-6 top-6 w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/20 flex items-center justify-center text-outline-variant hover:text-white transition-colors text-sm font-bold z-10 backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <h2 className="font-display text-4xl text-white mb-8 text-center font-black uppercase tracking-widest drop-shadow-md">
              PLAYER <span className="text-primary drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]">PROFILE</span>
            </h2>

            {error && (
              <div className="mb-6 p-4 rounded-xl font-display text-xs uppercase tracking-widest text-error bg-error/20 border border-error/50 shadow-neon-accent font-bold text-center">
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-xl font-display text-xs uppercase tracking-widest text-primary bg-primary/20 border border-primary/50 text-center shadow-neon-primary font-black">
                ✓ PROFILE UPDATED
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block font-display text-xs font-bold uppercase tracking-[0.2em] text-outline-variant mb-2 ml-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your display name"
                  required
                  maxLength={50}
                  className="w-full bg-black/50 border border-white/20 text-white rounded-xl px-5 py-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md shadow-inner backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block font-display text-xs font-bold uppercase tracking-[0.2em] text-outline-variant mb-3 ml-1">
                  Select Avatar
                </label>
                
                <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-3 scrollbar-none border border-white/10 rounded-xl bg-white/5 shadow-inner backdrop-blur-sm">
                  {AVATARS.map((av) => {
                    const isSelected = selectedAvatar === av.id;
                    return (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 border ${
                          isSelected 
                            ? 'border-primary bg-primary/20 shadow-neon-primary z-10' 
                            : 'border-white/10 bg-black/40 hover:border-white/30 hover:bg-white/10'
                        }`}
                      >
                        <UserAvatar avatarId={av.id} className={`w-12 h-12 object-cover rounded-full border-2 bg-black ${isSelected ? 'border-primary drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]' : 'border-white/20'}`} />
                        <span className={`font-display text-[10px] mt-2 font-bold truncate max-w-full text-center uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-outline-variant'}`}>
                          {av.name.split(' ')[0]}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={saving} 
                className="w-full py-4 mt-8 bg-primary text-white font-display font-black tracking-widest rounded-xl hover:bg-primary-hover hover:shadow-neon-primary transition-all uppercase"
              >
                {saving ? 'UPDATING...' : 'SAVE CHANGES'}
              </motion.button>
            </form>

            <div className="mt-8 border-t border-white/10 pt-6">
              <button
                onClick={() => { setPwSection(v => !v); setPwStep('idle'); setPwError(''); setPwOtp(['','','','','','']); }}
                className="w-full font-display text-[10px] sm:text-xs font-bold text-outline-variant uppercase tracking-[0.2em] hover:text-primary transition-colors py-2 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">{pwSection ? 'visibility_off' : 'lock'}</span> {pwSection ? 'HIDE SECURITY' : 'CHANGE PASSWORD'}
              </button>

              <AnimatePresence>
                {pwSection && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md">
                      {pwError && (
                        <div className="mb-4 p-3 rounded-xl font-display font-bold text-[10px] text-error uppercase tracking-widest bg-error/20 border border-error/50 shadow-neon-accent text-center">
                          ⚠️ {pwError}
                        </div>
                      )}

                      {pwStep === 'done' ? (
                        <div className="text-center py-6 text-primary font-display font-black text-xs sm:text-sm uppercase tracking-[0.2em] flex flex-col items-center gap-4">
                          <span className="material-symbols-outlined text-5xl drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]">check_circle</span>
                          PASSWORD CHANGED SUCCESSFULLY
                        </div>
                      ) : pwStep === 'idle' ? (
                        <div className="space-y-4">
                          <div>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="New Password (min 6 chars)"
                              className="w-full bg-black/50 border border-white/20 text-white rounded-xl px-5 py-4 outline-none focus:border-primary transition-all font-body-md shadow-inner"
                            />
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSendPwOtp} 
                            disabled={pwLoading}
                            className="w-full py-4 bg-transparent border border-primary text-primary hover:bg-primary/10 font-display font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3"
                          >
                            {pwLoading ? 'SENDING...' : 'SEND OTP TO EMAIL'}
                            {!pwLoading && <span className="material-symbols-outlined text-[20px]">mail</span>}
                          </motion.button>
                        </div>
                      ) : (
                        <form onSubmit={handleVerifyPwOtp} className="space-y-6">
                          <p className="font-display font-bold text-[10px] sm:text-xs text-outline-variant text-center uppercase tracking-[0.2em]">ENTER 6-DIGIT VERIFICATION CODE</p>
                          <div className="flex justify-center gap-2 sm:gap-3">
                            {pwOtp.map((d, i) => (
                              <input key={i} ref={pwOtpRefs[i]} type="text" inputMode="numeric" maxLength={1} value={d}
                                onChange={(e) => handlePwOtpInput(i, e.target.value)}
                                onKeyDown={(e) => handlePwOtpKeyDown(i, e)}
                                className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-2xl sm:text-3xl font-display font-black bg-black/50 rounded-xl border-2 outline-none transition-all shadow-inner ${d ? 'border-primary text-primary drop-shadow-[0_0_8px_rgba(0,255,135,0.5)]' : 'border-white/20 text-white focus:border-primary/50'}`}
                              />
                            ))}
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            disabled={pwLoading}
                            className="w-full py-4 bg-primary text-white hover:bg-primary-hover hover:shadow-neon-primary font-display font-black uppercase tracking-widest rounded-xl transition-all mt-4 flex items-center justify-center gap-3"
                          >
                            {pwLoading ? 'VERIFYING...' : 'CONFIRM NEW PASSWORD'}
                            {!pwLoading && <span className="material-symbols-outlined text-[20px]">lock_open</span>}
                          </motion.button>
                          <button type="button" onClick={() => { setPwStep('idle'); setPwOtp(['','','','','','']); }}
                            className="w-full font-display font-bold text-[10px] text-outline-variant hover:text-primary uppercase tracking-[0.2em] transition-colors mt-2">
                            {pwCooldown > 0 ? `RESEND IN ${pwCooldown}s` : 'RESEND CODE'}
                          </button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
