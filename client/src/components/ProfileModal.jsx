import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import UserAvatar, { AVATARS } from './UserAvatar';
import api from '../api/axios';
import confetti from 'canvas-confetti';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUserProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'br_dribbler');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [animate, setAnimate] = useState(false);

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
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setAnimate(false);
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
    setAnimate(false);
    setTimeout(() => {
      onClose();
      setPwSection(false);
      setPwStep('idle');
      setPwOtp(['','','','','','']);
      setNewPassword('');
      setPwError('');
    }, 250);
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

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className={`w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-none rounded-2xl p-6 sm:p-8 relative transition-all duration-300 glass-panel shadow-xl border border-outline-variant/30 ${animate ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>


        <button
          onClick={handleClose}
          className="absolute right-6 top-6 w-10 h-10 rounded-full border border-outline-variant/30 bg-black/40 hover:bg-white/10 flex items-center justify-center text-on-surface-variant hover:text-white transition-colors text-sm font-bold z-10"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <h2 className="font-display-lg text-4xl text-on-surface mb-8 text-center font-bold uppercase tracking-wide drop-shadow-md">
          PLAYER <span className="text-primary">PROFILE</span>
        </h2>

        {error && (
          <div className="mb-6 p-3 rounded font-label-md text-xs uppercase tracking-widest text-error bg-error/10 border border-error/30 shadow-neon-accent">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 rounded font-label-md text-xs uppercase tracking-widest text-primary bg-primary/10 border border-primary/30 text-center shadow-neon-primary">
            ✓ PROFILE UPDATED
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block font-label-md text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2 ml-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              required
              maxLength={50}
              className="w-full bg-black/40 border border-outline-variant/50 text-on-surface rounded-xl px-5 py-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md shadow-inner"
            />
          </div>

          <div>
            <label className="block font-label-md text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3 ml-1">
              Select Avatar
            </label>
            
            <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2 scrollbar-none border border-outline-variant/30 rounded-xl bg-black/20 shadow-inner">
              {AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 border active:scale-95 ${
                      isSelected 
                        ? 'border-primary bg-primary/10 shadow-neon-primary scale-[1.02] z-10' 
                        : 'border-transparent bg-transparent hover:border-outline-variant/50 hover:bg-white/5'
                    }`}
                  >
                    <UserAvatar avatarId={av.id} className={`w-12 h-12 object-cover rounded-full border-2 ${isSelected ? 'border-primary drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]' : 'border-outline-variant/50'}`} />
                    <span className={`font-label-md text-[10px] mt-2 truncate max-w-full text-center uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {av.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-4 mt-8 btn-primary text-base">
            {saving ? 'UPDATING...' : 'SAVE CHANGES'}
          </button>
        </form>

        <div className="mt-8 border-t border-outline-variant/30 pt-6">
          <button
            onClick={() => { setPwSection(v => !v); setPwStep('idle'); setPwError(''); setPwOtp(['','','','','','']); }}
            className="w-full font-label-md text-xs text-on-surface-variant uppercase tracking-[0.2em] hover:text-primary transition-colors py-2 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">{pwSection ? 'visibility_off' : 'lock'}</span> {pwSection ? 'HIDE SECURITY' : 'CHANGE PASSWORD'}
          </button>

          {pwSection && (
            <div className="mt-6 animate-fade-in bg-black/30 p-5 rounded-xl border border-outline-variant/20 shadow-inner">
              {pwError && (
                <div className="mb-4 p-3 rounded font-label-md text-xs text-error uppercase tracking-widest bg-error/10 border border-error/30 shadow-neon-accent">
                  ⚠️ {pwError}
                </div>
              )}

              {pwStep === 'done' ? (
                <div className="text-center py-6 text-primary font-label-md text-sm uppercase tracking-[0.2em] animate-fade-in flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
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
                      className="w-full bg-black/60 border border-outline-variant/50 text-on-surface rounded-lg px-5 py-4 outline-none focus:border-primary transition-all font-body-md"
                    />
                  </div>
                  <button onClick={handleSendPwOtp} disabled={pwLoading}
                    className="w-full py-4 btn-ghost flex items-center justify-center gap-2">
                    {pwLoading ? 'SENDING...' : 'SEND OTP TO EMAIL'}
                    {!pwLoading && <span className="material-symbols-outlined text-[18px]">mail</span>}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyPwOtp} className="space-y-5">
                  <p className="font-label-md text-xs text-on-surface-variant text-center uppercase tracking-[0.1em]">ENTER 6-DIGIT VERIFICATION CODE</p>
                  <div className="flex justify-center gap-3">
                    {pwOtp.map((d, i) => (
                      <input key={i} ref={pwOtpRefs[i]} type="text" inputMode="numeric" maxLength={1} value={d}
                        onChange={(e) => handlePwOtpInput(i, e.target.value)}
                        onKeyDown={(e) => handlePwOtpKeyDown(i, e)}
                        className={`w-12 h-14 text-center text-3xl font-display-lg bg-black/60 rounded-lg border-2 outline-none transition-all shadow-inner ${d ? 'border-primary text-primary drop-shadow-[0_0_5px_rgba(0,255,135,0.5)]' : 'border-outline-variant/30 text-on-surface focus:border-primary/50'}`}
                      />
                    ))}
                  </div>
                  <button type="submit" disabled={pwLoading}
                    className="w-full py-4 btn-primary mt-2 flex items-center justify-center gap-2">
                    {pwLoading ? 'VERIFYING...' : 'CONFIRM NEW PASSWORD'}
                    {!pwLoading && <span className="material-symbols-outlined text-[18px]">lock_open</span>}
                  </button>
                  <button type="button" onClick={() => { setPwStep('idle'); setPwOtp(['','','','','','']); }}
                    className="w-full font-label-md text-[10px] text-on-surface-variant hover:text-primary uppercase tracking-[0.2em] transition-colors mt-2">
                    {pwCooldown > 0 ? `RESEND IN ${pwCooldown}s` : 'RESEND CODE'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
